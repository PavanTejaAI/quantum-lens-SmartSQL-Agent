from src.db import db
from src.utils import logger
import jwt
try:
    import bcrypt
except ImportError:
    bcrypt = None
from datetime import datetime, timedelta
from src.config.config import JWT_SECRET, JWT_EXPIRATION
from werkzeug.security import generate_password_hash, check_password_hash
from src.utils.exceptions import AuthenticationError

class AuthService:
    def __init__(self):
        self.db = db

    def register_user(self, user_data):
        with self.db.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", (user_data['email'],))
            if cursor.fetchone():
                raise AuthenticationError("Email already registered")

            hashed_password = generate_password_hash(user_data['password'], method='pbkdf2:sha256:30000')
            logger.info(f"Generated hash for registration: {hashed_password}")
            cursor.execute(
                "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
                (user_data['name'], user_data['email'], hashed_password)
            )
            user_id = cursor.lastrowid

        token = self._generate_token(user_id)
        logger.info(f"User registered successfully: {user_data['email']}")
        return {
            'id': user_id,
            'name': user_data['name'],
            'email': user_data['email'],
            'token': token
        }

    def login_user(self, credentials):
        with self.db.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", (credentials['email'],))
            user = cursor.fetchone()
            
            if not user:
                logger.warning(f"Login failed: User not found for email: {credentials['email']}")
                raise AuthenticationError("Invalid email or password")

            logger.info(f"Stored hash: {user['password']}")
            logger.info(f"Checking password for user: {credentials['email']}")
            
            # Handle both bcrypt and pbkdf2 hashes
            stored_hash = user['password']
            if stored_hash.startswith('$2b$'):
                if bcrypt is None:
                    logger.error("bcrypt module not found, cannot verify old password hash")
                    raise AuthenticationError("Unable to verify password")
                
                is_valid = bcrypt.checkpw(credentials['password'].encode('utf-8'), stored_hash.encode('utf-8'))
                if is_valid:
                    # Update to new hash method
                    new_hash = generate_password_hash(credentials['password'], method='pbkdf2:sha256:30000')
                    cursor.execute(
                        "UPDATE users SET password = %s WHERE id = %s",
                        (new_hash, user['id'])
                    )
                    logger.info(f"Updated password hash for user: {credentials['email']}")
                else:
                    logger.warning(f"Login failed: Invalid password for email: {credentials['email']}")
                    raise AuthenticationError("Invalid email or password")
            else:
                # For pbkdf2 hashes
                if not check_password_hash(stored_hash, credentials['password']):
                    logger.warning(f"Login failed: Invalid password for email: {credentials['email']}")
                    raise AuthenticationError("Invalid email or password")

            token = self._generate_token(user['id'])
            logger.info(f"User logged in successfully: {credentials['email']}")
            return {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'token': token
            }

    def update_profile(self, user_id, profile_data):
        with self.db.cursor() as cursor:
            if profile_data.get('currentPassword') and profile_data.get('newPassword'):
                cursor.execute("SELECT password FROM users WHERE id = %s", (user_id,))
                user = cursor.fetchone()
                
                if not check_password_hash(user['password'], profile_data['currentPassword']):
                    raise AuthenticationError("Current password is incorrect")
                    
                if profile_data['newPassword'] != profile_data['confirmPassword']:
                    raise AuthenticationError("New passwords do not match")
                    
                hashed_password = generate_password_hash(profile_data['newPassword'], method='pbkdf2:sha256:30000')
                cursor.execute(
                    "UPDATE users SET password = %s WHERE id = %s",
                    (hashed_password, user_id)
                )

            if profile_data.get('name'):
                cursor.execute(
                    "UPDATE users SET name = %s WHERE id = %s",
                    (profile_data['name'], user_id)
                )

            cursor.execute("SELECT id, name, email FROM users WHERE id = %s", (user_id,))
            user = cursor.fetchone()
            return {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'token': None
            }

    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            with self.db.cursor() as cursor:
                cursor.execute("SELECT id, name, email FROM users WHERE id = %s", (payload['user_id'],))
                user = cursor.fetchone()
                if user:
                    return {
                        'id': user['id'],
                        'name': user['name'],
                        'email': user['email'],
                        'token': None
                    }
                return None
        except jwt.ExpiredSignatureError:
            logger.warning("Token verification failed: Token expired")
            return None
        except jwt.InvalidTokenError as e:
            logger.error(f"Token verification failed: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Token verification failed: {str(e)}")
            return None

    def _generate_token(self, user_id):
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(seconds=JWT_EXPIRATION)
        }
        return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

    @staticmethod
    def init_db():
        create_table_query = """
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
        """
        try:
            db.execute_write(create_table_query)
            logger.info("Users table initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize users table: {str(e)}")
            raise
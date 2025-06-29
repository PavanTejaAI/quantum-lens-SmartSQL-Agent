from src.db import db
from src.utils import logger
from src.utils.exceptions import ValidationError
from datetime import datetime
import json
import pymysql
from pymysql.cursors import DictCursor
import base64
import binascii

class ProjectService:
    def __init__(self):
        self.db = db

    def create_project(self, user_id: int, project_data: dict):
        with self.db.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO projects (name, description, encrypted_path, user_id, created_at, updated_at)
                VALUES (%s, %s, %s, %s, NOW(), NOW())
                """,
                (project_data['name'], project_data.get('description'), project_data['encrypted_path'], user_id)
            )
            project_id = cursor.lastrowid

            cursor.execute(
                "SELECT id, name, description, encrypted_path, created_at, updated_at FROM projects WHERE id = %s",
                (project_id,)
            )
            project = cursor.fetchone()
            project['created_at'] = project['created_at'].isoformat()
            project['updated_at'] = project['updated_at'].isoformat()
            return project

    def get_user_projects(self, user_id: int):
        with self.db.cursor() as cursor:
            cursor.execute(
                "SELECT id, name, description, encrypted_path, created_at, updated_at FROM projects WHERE user_id = %s",
                (user_id,)
            )
            projects = cursor.fetchall()
            for project in projects:
                project['created_at'] = project['created_at'].isoformat()
                project['updated_at'] = project['updated_at'].isoformat()
            return projects

    def get_project(self, project_id: int, user_id: int):
        with self.db.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, name, description, encrypted_path, created_at, updated_at 
                FROM projects 
                WHERE id = %s AND user_id = %s
                """,
                (project_id, user_id)
            )
            project = cursor.fetchone()
            if project:
                project['created_at'] = project['created_at'].isoformat()
                project['updated_at'] = project['updated_at'].isoformat()
            return project

    def update_project(self, project_id: int, user_id: int, project_data: dict):
        if not project_data:
            raise ValidationError("No update data provided")

        update_fields = []
        params = []
        for key, value in project_data.items():
            if value is not None:
                update_fields.append(f"{key} = %s")
                params.append(value)

        if not update_fields:
            raise ValidationError("No valid fields to update")

        params.extend([project_id, user_id])
        update_query = f"""
            UPDATE projects 
            SET {', '.join(update_fields)}, updated_at = NOW()
            WHERE id = %s AND user_id = %s
            RETURNING id, name, description, encrypted_path, created_at, updated_at
        """

        with self.db.cursor() as cursor:
            cursor.execute(update_query, params)
            project = cursor.fetchone()
            if project:
                project['created_at'] = project['created_at'].isoformat()
                project['updated_at'] = project['updated_at'].isoformat()
            return project

    def delete_project(self, project_id: int, user_id: int):
        with self.db.cursor() as cursor:
            cursor.execute(
                "DELETE FROM projects WHERE id = %s AND user_id = %s",
                (project_id, user_id)
            )
            return cursor.rowcount > 0

    def get_database_info(self, project_id: int, user_id: int):
        project = self.get_project(project_id, user_id)
        if not project:
            raise ValidationError("Project not found")

        try:
            encrypted_path = project['encrypted_path']
            if not encrypted_path:
                logger.error(f"No encrypted_path found for project {project_id}")
                raise ValueError("No encrypted path found in project")
                
            logger.debug(f"Decoding encrypted path for project {project_id}")
            project_data = json.loads(base64.b64decode(encrypted_path).decode('utf-8'))
            db_config = project_data.get('dbConfig', {})

            if not db_config:
                logger.warning(f"No dbConfig found for project {project_id}, returning empty database info")
                return {
                    "database_name": "",
                    "tables": [],
                    "connection_status": False,
                    "database_info": {}
                }

            logger.debug(f"Attempting database connection for project {project_id}")
            user_db = pymysql.connect(
                host=db_config.get('host', 'localhost'),
                port=int(db_config.get('port', 3306)),
                user=db_config.get('user'),
                password=db_config.get('password', ''),
                database=db_config.get('database'),
                cursorclass=DictCursor,
                connect_timeout=5
            )

            try:
                with user_db.cursor() as cursor:
                    cursor.execute("SELECT DATABASE() as db_name")
                    db_info = cursor.fetchone()
                    
                    cursor.execute("""
                        SELECT 
                            table_name,
                            (SELECT COUNT(*) FROM information_schema.columns 
                             WHERE table_schema = DATABASE() 
                             AND table_name = t.table_name) as column_count,
                            COALESCE(table_rows, 0) as row_count
                        FROM information_schema.tables t
                        WHERE table_schema = DATABASE()
                          AND table_type = 'BASE TABLE'
                    """)
                    tables = cursor.fetchall()

                    logger.info(f"Successfully connected to database for project {project_id}, found {len(tables)} tables")
                    return {
                        "database_name": db_info["db_name"],
                        "tables": [
                            {
                                "name": table["table_name"],
                                "row_count": int(table["row_count"]),
                                "column_count": int(table["column_count"])
                            }
                            for table in tables
                        ],
                        "connection_status": True,
                        "database_info": {
                            "host": db_config.get('host', 'localhost'),
                            "port": int(db_config.get('port', 3306)),
                            "user": db_config.get('user'),
                            "password": db_config.get('password', ''),
                            "database": db_config.get('database')
                        }
                    }
            finally:
                user_db.close()

        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode JSON from encrypted_path for project {project_id}: {e}")
            raise ValidationError("Invalid project configuration format")
        except base64.binascii.Error as e:
            logger.error(f"Failed to decode base64 encrypted_path for project {project_id}: {e}")
            raise ValidationError("Invalid project configuration encoding")
        except pymysql.Error as e:
            logger.error(f"Database connection error for project {project_id}: {str(e)}")
            return {
                "database_name": db_config.get('database', '') if 'db_config' in locals() else '',
                "tables": [],
                "connection_status": False,
                "database_info": {
                    "host": db_config.get('host', 'localhost') if 'db_config' in locals() else 'localhost',
                    "port": int(db_config.get('port', 3306)) if 'db_config' in locals() else 3306,
                    "user": db_config.get('user') if 'db_config' in locals() else '',
                    "password": db_config.get('password', '') if 'db_config' in locals() else '',
                    "database": db_config.get('database') if 'db_config' in locals() else ''
                }
            }
        except Exception as e:
            logger.error(f"Unexpected error getting database info for project {project_id}: {str(e)}")
            raise ValidationError(f"Failed to get database information: {str(e)}")

    @staticmethod
    def init_db():
        create_table_query = """
        CREATE TABLE IF NOT EXISTS projects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            encrypted_path TEXT NOT NULL,
            user_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        """
        try:
            db.execute_write(create_table_query)
            logger.info("Projects table initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize projects table: {str(e)}")
            raise 
import os
from dotenv import load_dotenv
from ..utils import logger

load_dotenv()

required_env_vars = [
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    # 'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET',
    'OPENROUTER_API_KEY',
    'SITE_URL',
    'SITE_NAME'
]

missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
    raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_vars)}")

MYSQL_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', '3306')),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ' '),
    'db': os.getenv('DB_NAME', 'quantum_lens'),
    'charset': 'utf8mb4',
    'cursorclass': 'DictCursor',
    'connect_timeout': 30, 
    'read_timeout': 30,
    'write_timeout': 30
}

JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key-for-development')
JWT_EXPIRATION = int(os.getenv('JWT_EXPIRATION', '3600'))

API_PREFIX = '/api/v1'

OPENROUTER_CONFIG = {
    'api_key': os.getenv('OPENROUTER_API_KEY'),
    'base_url': 'https://openrouter.ai/api/v1',
    'site_url': os.getenv('SITE_URL'),
    'site_name': os.getenv('SITE_NAME'),
    'default_model': 'deepseek/deepseek-chat-v3-0324:free'
}

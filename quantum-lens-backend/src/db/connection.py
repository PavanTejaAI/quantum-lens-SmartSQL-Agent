import pymysql
from pymysql.cursors import DictCursor
from contextlib import contextmanager
from src.config.config import MYSQL_CONFIG
from src.utils import logger

class Database:
    def __init__(self):
        self._connection_params = {
            **MYSQL_CONFIG,
            'cursorclass': DictCursor
        }
        self._connection = None

    def connect(self):
        if not self._connection:
            try:
                self._connection = pymysql.connect(**self._connection_params)
                logger.info("Database connection established successfully")
            except pymysql.Error as e:
                logger.error(f"Database connection failed: {str(e)}")
                raise

    def disconnect(self):
        if self._connection:
            try:
                self._connection.close()
                self._connection = None
                logger.info("Database connection closed successfully")
            except pymysql.Error as e:
                logger.error(f"Error closing database connection: {str(e)}")
                raise

    @contextmanager
    def cursor(self):
        if not self._connection:
            self.connect()
        
        cursor = self._connection.cursor()
        try:
            yield cursor
            self._connection.commit()
        except pymysql.Error as e:
            self._connection.rollback()
            logger.error(f"Database operation failed: {str(e)}")
            raise
        finally:
            cursor.close()

    def execute_query(self, query, params=None):
        with self.cursor() as cursor:
            cursor.execute(query, params or ())
            return cursor.fetchall()

    def execute_single(self, query, params=None):
        with self.cursor() as cursor:
            cursor.execute(query, params or ())
            return cursor.fetchone()

    def execute_write(self, query, params=None):
        with self.cursor() as cursor:
            cursor.execute(query, params or ())
            return cursor.lastrowid

db = Database() 
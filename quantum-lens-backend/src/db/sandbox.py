import mysql.connector
from typing import Dict, List, Any, Optional
from datetime import datetime
import json
import pandas as pd
from io import StringIO

class MySQLSandbox:
    def __init__(self, db_config: Dict[str, str]):
        self.db_config = db_config
        self.connection = None
        self.cursor = None
        self._connect()

    def _connect(self):
        try:
            self.connection = mysql.connector.connect(
                host=self.db_config['host'],
                user=self.db_config['user'],
                password=self.db_config['password'],
                database=self.db_config['database'],
                port=int(self.db_config.get('port', 3306))
            )
            self.cursor = self.connection.cursor(dictionary=True)
        except mysql.connector.Error as err:
            raise Exception(f"Failed to connect to MySQL: {err}")

    def _ensure_connection(self):
        try:
            if self.connection and self.connection.is_connected():
                return
            self._connect()
        except Exception as e:
            raise Exception(f"Failed to ensure connection: {e}")

    def execute_query(self, query: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        start_time = datetime.now()
        result = {
            'success': False,
            'data': None,
            'error': None,
            'execution_time': 0,
            'affected_rows': 0,
            'column_info': [],
            'query_type': None
        }

        try:
            self._ensure_connection()
            
            query_type = query.strip().split()[0].upper()
            result['query_type'] = query_type

            self.cursor.execute(query, params or {})
            
            if query_type in ['SELECT', 'SHOW', 'DESCRIBE', 'EXPLAIN']:
                rows = self.cursor.fetchall()
                if rows:
                    df = pd.DataFrame(rows)
                    result['data'] = {
                        'records': rows,
                        'total_rows': len(rows),
                        'csv': df.to_csv(index=False),
                        'html': df.to_html(classes='table table-striped', index=False)
                    }
                    result['column_info'] = [
                        {'name': desc[0], 'type': str(desc[1])}
                        for desc in self.cursor.description
                    ]
                else:
                    result['data'] = {
                        'records': [],
                        'total_rows': 0,
                        'csv': '',
                        'html': '<p>No results found</p>'
                    }
            else:
                self.connection.commit()
                result['affected_rows'] = self.cursor.rowcount

            result['success'] = True

        except Exception as e:
            result['error'] = str(e)
            if self.connection:
                self.connection.rollback()
        finally:
            result['execution_time'] = (datetime.now() - start_time).total_seconds()

        return result

    def get_table_schema(self, table_name: str) -> Dict[str, Any]:
        try:
            self._ensure_connection()
            
            schema_info = {
                'columns': [],
                'indexes': [],
                'foreign_keys': []
            }

            self.cursor.execute(f"DESCRIBE {table_name}")
            columns = self.cursor.fetchall()
            schema_info['columns'] = columns

            self.cursor.execute(f"SHOW INDEXES FROM {table_name}")
            indexes = self.cursor.fetchall()
            schema_info['indexes'] = indexes

            self.cursor.execute(f"""
                SELECT 
                    COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
                FROM 
                    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                WHERE 
                    TABLE_NAME = %s AND
                    REFERENCED_TABLE_NAME IS NOT NULL
            """, (table_name,))
            foreign_keys = self.cursor.fetchall()
            schema_info['foreign_keys'] = foreign_keys

            return {
                'success': True,
                'data': schema_info
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def get_database_info(self) -> Dict[str, Any]:
        try:
            self._ensure_connection()
            
            self.cursor.execute("SHOW TABLES")
            tables = [table[f"Tables_in_{self.db_config['database']}"] for table in self.cursor.fetchall()]
            
            database_info = {
                'tables': [],
                'total_tables': len(tables),
                'database_name': self.db_config['database'],
                'server_info': self.connection.get_server_info()
            }

            for table in tables:
                self.cursor.execute(f"SELECT COUNT(*) as count FROM {table}")
                row_count = self.cursor.fetchone()['count']

                self.cursor.execute(f"SHOW CREATE TABLE {table}")
                create_table = self.cursor.fetchone()['Create Table']

                schema_info = self.get_table_schema(table)

                database_info['tables'].append({
                    'name': table,
                    'row_count': row_count,
                    'create_statement': create_table,
                    'schema': schema_info.get('data', {})
                })

            return {
                'success': True,
                'data': database_info
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def close(self):
        try:
            if self.cursor:
                self.cursor.close()
            if self.connection:
                self.connection.close()
        except Exception:
            pass 
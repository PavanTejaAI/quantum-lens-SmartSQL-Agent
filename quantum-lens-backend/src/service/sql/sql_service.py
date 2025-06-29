from typing import Dict, Any, List, Optional
from ...db.sandbox import MySQLSandbox
from ...llm import OpenRouterClient
from ...utils import logger
import json

class SQLService:
    def __init__(self, llm_client: Optional[OpenRouterClient] = None):
        self.llm_client = llm_client or OpenRouterClient.get_instance()
        self.sandbox_instances = {}

    async def process_message(self, message: str, project_id: str, schema: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        try:
            intent_context = {
                "user_message": message,
                "request_type": "intent_check"
            }
            
            intent_response = await self.llm_client.generate_sql_completion('intent', intent_context)
            
            try:
                intent_data = json.loads(intent_response)
            except json.JSONDecodeError:
                return await self._process_message_legacy(message, project_id, schema, context)
            
            if not intent_data.get('is_sql_query', False):
                return {
                    "success": True,
                    "type": "text",
                    "content": intent_data.get('response', "I help with database questions. Is there anything about your data I can help you with?")
                }
            
            comprehensive_context = {
                "user_message": message,
                "schema": schema,
                "context": context or {},
                "request_type": "comprehensive_sql_analysis"
            }
            
            comprehensive_response = await self.llm_client.generate_sql_completion('comprehensive', comprehensive_context)
            
            try:
                response_data = json.loads(comprehensive_response)
            except json.JSONDecodeError:
                return await self._process_message_legacy(message, project_id, schema, context)

            generated_query = response_data.get('sql_query', '').strip()
            if not generated_query:
                return {
                    "success": False,
                    "type": "error",
                    "content": {"error": "Failed to generate SQL query"}
                }

            if project_id not in self.sandbox_instances:
                db_config = {
                    "host": schema.get("database_info", {}).get("host", "localhost"),
                    "port": schema.get("database_info", {}).get("port", 3306),
                    "user": schema.get("database_info", {}).get("user"),
                    "password": schema.get("database_info", {}).get("password", ""),
                    "database": schema.get("database_name"),
                }
                self.sandbox_instances[project_id] = MySQLSandbox(db_config)
            sandbox = self.sandbox_instances[project_id]

            try:
                result = sandbox.execute_query(generated_query)
                
                if not result.get("success", False):
                    error_msg = result.get("error", "Query execution failed")
                    logger.error(f"Query execution failed: {error_msg}")
                    
                    error_context = {
                        "query": generated_query,
                        "error": error_msg,
                        "schema": schema
                    }
                    error_analysis = await self.llm_client.generate_sql_completion('error', error_context)
                    return {
                        "success": False,
                        "type": "error",
                        "content": {
                            "query": generated_query,
                            "error": error_msg,
                            "analysis": error_analysis
                        }
                    }
                
                data = result.get("data") or {}
                
                return {
                    "success": True,
                    "type": "sql",
                    "content": {
                        "query": generated_query,
                        "result": {
                            "rows": data.get("records", []),
                            "columns": result.get("column_info", []),
                            "total_rows": data.get("total_rows", 0),
                            "execution_time": result.get("execution_time", 0),
                            "affected_rows": result.get("affected_rows", 0)
                        },
                        "analysis": response_data.get('analysis', 'Query executed successfully'),
                        "optimization": response_data.get('optimization', 'No optimization suggestions available')
                    }
                }
                
            except Exception as e:
                # 🔥 Only make additional LLM call for error analysis if needed
                error_context = {
                    "query": generated_query,
                    "error": str(e),
                    "schema": schema
                }
                error_analysis = await self.llm_client.generate_sql_completion('error', error_context)
                return {
                    "success": False,
                    "type": "error",
                    "content": {
                        "query": generated_query,
                        "error": str(e),
                        "analysis": error_analysis
                    }
                }
                
        except Exception as e:
            logger.error(f"Error processing SQL message: {str(e)}")
            return {
                "success": False,
                "type": "error",
                "content": {
                    "error": str(e)
                }
            }

    async def _process_message_legacy(self, message: str, project_id: str, schema: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        try:
            intent_context = {"message": message}
            intent_check = await self.llm_client.generate_sql_completion('intent', intent_context)

            if intent_check.strip().upper() != 'YES':
                return {
                    "success": True,
                    "type": "text",
                    "content": "Non-SQL query detected"
                }

            if project_id not in self.sandbox_instances:
                db_config = {
                    "host": schema.get("database_info", {}).get("host", "localhost"),
                    "port": schema.get("database_info", {}).get("port", 3306),
                    "user": schema.get("database_info", {}).get("user"),
                    "password": schema.get("database_info", {}).get("password", ""),
                    "database": schema.get("database_name"),
                }
                self.sandbox_instances[project_id] = MySQLSandbox(db_config)
            sandbox = self.sandbox_instances[project_id]

            generator_context = {
                "schema": schema,
                "query": message,
                "context": context or {}
            }
            
            query_response = await self.llm_client.generate_sql_completion('generator', generator_context)
            generated_query = query_response.strip()
            
            try:
                result = sandbox.execute_query(generated_query)
                
                if not result.get("success", False):
                    error_msg = result.get("error", "Query execution failed")
                    logger.error(f"Query execution failed (legacy): {error_msg}")
                    
                    error_context = {
                        "query": generated_query,
                        "error": error_msg,
                        "schema": schema
                    }
                    error_analysis = await self.llm_client.generate_sql_completion('error', error_context)
                    return {
                        "success": False,
                        "type": "error",
                        "content": {
                            "query": generated_query,
                            "error": error_msg,
                            "analysis": error_analysis
                        }
                    }
                
                data = result.get("data") or {}
                
                analysis_context = {
                    "query": generated_query,
                    "results": {
                        "rows": data.get("records", []),
                        "columns": result.get("column_info", []),
                        "total_rows": data.get("total_rows", 0)
                    },
                    "metrics": {
                        "execution_time": result.get("execution_time", 0),
                        "affected_rows": result.get("affected_rows", 0)
                    }
                }
                
                analysis = await self.llm_client.generate_sql_completion('analyzer', analysis_context)
                
                optimizer_context = {
                    "query": generated_query,
                    "metrics": analysis_context["metrics"],
                    "schema": schema
                }
                optimization = await self.llm_client.generate_sql_completion('optimizer', optimizer_context)
                
                return {
                    "success": True,
                    "type": "sql",
                    "content": {
                        "query": generated_query,
                        "result": {
                            "rows": data.get("records", []),
                            "columns": result.get("column_info", []),
                            "total_rows": data.get("total_rows", 0),
                            "execution_time": result.get("execution_time", 0),
                            "affected_rows": result.get("affected_rows", 0)
                        },
                        "analysis": analysis,
                        "optimization": optimization
                    }
                }
                
            except Exception as e:
                error_context = {
                    "query": generated_query,
                    "error": str(e),
                    "schema": schema
                }
                error_analysis = await self.llm_client.generate_sql_completion('error', error_context)
                return {
                    "success": False,
                    "type": "error",
                    "content": {
                        "query": generated_query,
                        "error": str(e),
                        "analysis": error_analysis
                    }
                }
                
        except Exception as e:
            logger.error(f"Error processing SQL message (legacy): {str(e)}")
            return {
                "success": False,
                "type": "error",
                "content": {
                    "error": str(e)
                }
            }

    async def optimize_query(self, query: str, execution_plan: Optional[Dict] = None) -> Dict[str, Any]:
        try:
            optimization_context = {
                "query": query,
                "execution_plan": execution_plan,
                "metrics": {
                    "current_execution_time": execution_plan.get('execution_time') if execution_plan else None,
                    "estimated_cost": execution_plan.get('total_cost') if execution_plan else None,
                    "table_scans": execution_plan.get('table_scans', 0) if execution_plan else 0
                }
            }
            
            optimization_response = await self.llm_client.generate_sql_completion('optimizer', optimization_context)

            return {
                "type": "optimization",
                "content": {
                    "original_query": query,
                    "optimization_analysis": optimization_response
                }
            }

        except Exception as e:
            logger.error(f"Error optimizing query: {str(e)}")
            return {"type": "error", "content": str(e)}

    def _get_sandbox(self, project_id: int, db_config: Dict[str, str]) -> MySQLSandbox:
        if project_id not in self.sandbox_instances:
            self.sandbox_instances[project_id] = MySQLSandbox(db_config)
        return self.sandbox_instances[project_id]

    def _cleanup_sandbox(self, project_id: int):
        if project_id in self.sandbox_instances:
            self.sandbox_instances[project_id].close()
            del self.sandbox_instances[project_id]

    async def execute_query(self, project_id: int, db_config: Dict[str, str], query: str) -> Dict[str, Any]:
        try:
            sandbox = self._get_sandbox(project_id, db_config)
            result = sandbox.execute_query(query)
            
            if not result['success']:
                return result

            if result['query_type'] in ['SELECT', 'SHOW', 'DESCRIBE', 'EXPLAIN']:
                analysis_context = {
                    "query": query,
                    "metrics": {
                        "execution_time": result['execution_time'],
                        "total_rows": result['data']['total_rows'] if result['data'] else 0,
                        "columns": result['column_info'],
                        "sample_data": result['data']['records'][:5] if result['data'] and result['data']['records'] else []
                    }
                }

                result['llm_analysis'] = await self.llm_client.generate_sql_completion('analyzer', analysis_context)

            return result

        except Exception as e:
            logger.error(f"SQL execution error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

    async def get_query_suggestions(self, project_id: int, db_config: Dict[str, str], user_input: str) -> Dict[str, Any]:
        try:
            sandbox = self._get_sandbox(project_id, db_config)
            db_info = sandbox.get_database_info()

            if not db_info['success']:
                return {
                    'success': False,
                    'error': db_info['error']
                }

            suggestion_context = {
                'user_input': user_input,
                'database_schema': {
                    'tables': [
                        {
                            'name': table['name'],
                            'columns': [col['name'] for col in table['schema']['columns']],
                            'sample_row_count': table['row_count']
                        } for table in db_info['data']['tables']
                    ]
                }
            }

            suggestions = await self.llm_client.generate_sql_completion('generator', suggestion_context)

            return {
                'success': True,
                'suggestions': suggestions
            }

        except Exception as e:
            logger.error(f"Query suggestion error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

    async def explain_query(self, project_id: int, db_config: Dict[str, str], query: str) -> Dict[str, Any]:
        try:
            sandbox = self._get_sandbox(project_id, db_config)
            explain_result = sandbox.execute_query(f"EXPLAIN FORMAT=JSON {query}")

            if not explain_result['success']:
                return explain_result

            explain_context = {
                'query': query,
                'explain_plan': explain_result['data']['records'] if explain_result['data'] else None,
                'metrics': {
                    'execution_time': explain_result.get('execution_time'),
                    'estimated_rows': explain_result.get('estimated_rows'),
                    'access_type': explain_result.get('access_type')
                }
            }

            analysis = await self.llm_client.generate_sql_completion('optimizer', explain_context)

            return {
                'success': True,
                'explain_data': explain_result['data'],
                'analysis': analysis
            }

        except Exception as e:
            logger.error(f"Query explanation error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

    async def process_natural_language(self, project_id: int, db_config: Dict[str, str], user_message: str) -> Dict[str, Any]:
        try:
            sandbox = self._get_sandbox(project_id, db_config)
            db_info = sandbox.get_database_info()

            if not db_info['success']:
                return {
                    'success': False,
                    'error': db_info['error']
                }

            # Check intent
            intent_context = {"message": user_message}
            intent_check = await self.llm_client.generate_sql_completion('intent', intent_context)

            if 'NO' in intent_check.upper():
                return {
                    'success': True,
                    'is_query': False,
                    'message': None
                }

            query_context = {
                'user_message': user_message,
                'database_schema': {
                    'tables': [
                        {
                            'name': table['name'],
                            'columns': [col['name'] for col in table['schema']['columns']],
                            'sample_row_count': table['row_count']
                        } for table in db_info['data']['tables']
                    ]
                }
            }

            generated_query = await self.llm_client.generate_sql_completion('generator', query_context)
            generated_query = generated_query.strip()
            
            if not generated_query:
                return {
                    'success': False,
                    'error': 'Failed to generate SQL query'
                }

            result = sandbox.execute_query(generated_query)
            
            if not result['success']:
                return {
                    'success': False,
                    'error': f"Query execution failed: {result['error']}"
                }

            # Generate analysis
            response_context = {
                'original_question': user_message,
                'query': {
                    'sql': generated_query,
                    'execution_time': result['execution_time']
                },
                'results': {
                    'total_rows': result['data']['total_rows'] if result['data'] else 0,
                    'sample_data': result['data']['records'][:5] if result['data'] and result['data']['records'] else []
                }
            }

            analysis = await self.llm_client.generate_sql_completion('analyzer', response_context)

            return {
                'success': True,
                'is_query': True,
                'query': generated_query,
                'result': result,
                'message': analysis
            }

        except Exception as e:
            logger.error(f"Natural language processing error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            } 
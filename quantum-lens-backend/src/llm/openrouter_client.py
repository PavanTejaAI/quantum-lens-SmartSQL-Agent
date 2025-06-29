from openai import AsyncOpenAI, OpenAI
from openai.types.chat import ChatCompletion
from src.config.config import OPENROUTER_CONFIG
from src.utils import logger
from src.utils.exceptions import AppException, ValidationError
from src.prompts.sql_analytics_prompts import get_prompt_template
from typing import List, Dict, Optional, Any
import json

class LLMError(AppException):
    def __init__(self, detail: str):
        super().__init__(500, f"LLM Error: {detail}")

class OpenRouterClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(OpenRouterClient, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
            
        try:
            self.client = OpenAI(
                base_url=OPENROUTER_CONFIG['base_url'],
                api_key=OPENROUTER_CONFIG['api_key']
            )
            self.async_client = AsyncOpenAI(
                base_url=OPENROUTER_CONFIG['base_url'],
                api_key=OPENROUTER_CONFIG['api_key']
            )
            self.default_model = OPENROUTER_CONFIG['default_model']
            self.extra_headers = {
                "HTTP-Referer": OPENROUTER_CONFIG['site_url'],
                "X-Title": OPENROUTER_CONFIG['site_name']
            }
            self._initialized = True
            logger.info("OpenRouter client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize OpenRouter client: {str(e)}")
            raise LLMError(f"Failed to initialize LLM client: {str(e)}")

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _validate_messages(self, messages: List[Dict[str, str]]) -> None:
        if not messages:
            raise ValidationError("Messages list cannot be empty")
        
        for msg in messages:
            if not isinstance(msg, dict):
                raise ValidationError("Each message must be a dictionary")
            if 'role' not in msg or 'content' not in msg:
                raise ValidationError("Each message must contain 'role' and 'content' keys")
            if msg['role'] not in ['user', 'assistant', 'system']:
                raise ValidationError("Message role must be 'user', 'assistant', or 'system'")
            if not isinstance(msg['content'], str):
                raise ValidationError("Message content must be a string")

    def _prepare_prompt(self, prompt_type: str, context: Dict[str, Any]) -> List[Dict[str, str]]:
        prompt_template = get_prompt_template(prompt_type)
        
        if prompt_type == 'intent':
            formatted_content = context.get('user_message', context.get('message', ''))
        elif prompt_type == 'generator':
            formatted_content = f"Schema Context:\n{json.dumps(context.get('schema', {}), indent=2)}\n\nUser Query: {context.get('query', '')}"
        elif prompt_type == 'analyzer':
            formatted_content = f"Analysis Context:\n{json.dumps(context, indent=2)}"
        elif prompt_type == 'optimizer':
            formatted_content = f"Optimization Context:\n{json.dumps(context, indent=2)}"
        elif prompt_type == 'error':
            formatted_content = f"Error Context:\n{json.dumps(context, indent=2)}"
        else:
            formatted_content = json.dumps(context, indent=2)

        return [
            {"role": "system", "content": prompt_template["system"]},
            {"role": "user", "content": formatted_content}
        ]

    async def generate_sql_completion(self, prompt_type: str, context: Dict[str, Any], model: Optional[str] = None) -> str:
        try:
            messages = self._prepare_prompt(prompt_type, context)
            return await self.generate_completion_async(messages, model)
        except Exception as e:
            logger.error(f"Error generating SQL completion for {prompt_type}: {str(e)}")
            raise LLMError(f"Failed to generate SQL completion: {str(e)}")

    def generate_completion(self, messages: List[Dict[str, str]], model: Optional[str] = None) -> str:
        try:
            self._validate_messages(messages)
            logger.info(f"Generating completion for model: {model or self.default_model}")
            logger.debug(f"Input messages: {json.dumps(messages, indent=2)}")

            completion: ChatCompletion = self.client.chat.completions.create(
                extra_headers=self.extra_headers,
                extra_body={},
                model=model or self.default_model,
                messages=messages
            )

            response = completion.choices[0].message.content
            logger.info("Successfully generated completion")
            logger.debug(f"Generated response: {response}")
            return response

        except ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Error generating completion: {str(e)}")
            raise LLMError(f"Failed to generate completion: {str(e)}")

    async def generate_completion_async(self, messages: List[Dict[str, str]], model: Optional[str] = None) -> str:
        try:
            self._validate_messages(messages)
            logger.info(f"Generating async completion for model: {model or self.default_model}")
            logger.debug(f"Input messages: {json.dumps(messages, indent=2)}")

            completion = await self.async_client.chat.completions.create(
                extra_headers=self.extra_headers,
                extra_body={},
                model=model or self.default_model,
                messages=messages
            )

            response = completion.choices[0].message.content
            logger.info("Successfully generated async completion")
            logger.debug(f"Generated response: {response}")
            return response

        except ValidationError as e:
            logger.error(f"Validation error in async completion: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Error generating async completion: {str(e)}")
            raise LLMError(f"Failed to generate async completion: {str(e)}") 
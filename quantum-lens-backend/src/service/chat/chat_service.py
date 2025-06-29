from src.llm import OpenRouterClient
from src.utils.exceptions import ValidationError
from src.utils import logger
from typing import List, Dict, Optional
import uuid
import json
from datetime import datetime

class ChatService:
    def __init__(self, llm_client: Optional[OpenRouterClient] = None):
        self.llm_client = llm_client or OpenRouterClient.get_instance()
        self._sessions = {}
        self._messages = {}

    async def get_completion(
        self,
        messages: List[Dict[str, str]],
        project_id: int,
        user_id: int
    ) -> Dict[str, str]:
        if not messages:
            raise ValidationError("Messages list cannot be empty")

        session_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()

        try:
            response = await self.llm_client.generate_completion_async(messages)
            
            session_data = {
                "id": session_id,
                "project_id": project_id,
                "user_id": user_id,
                "created_at": timestamp,
                "updated_at": timestamp
            }
            
            message_data = [
                {
                    "role": msg["role"],
                    "content": msg["content"],
                    "timestamp": timestamp
                }
                for msg in messages
            ]
            
            message_data.append({
                "role": "assistant",
                "content": response,
                "timestamp": timestamp
            })
            
            self._sessions[session_id] = session_data
            self._messages[session_id] = message_data

            logger.info(f"Chat completion generated for session {session_id}")
            return {"response": response, "session_id": session_id}

        except Exception as e:
            logger.error(f"Error generating chat completion: {str(e)}")
            raise

    async def get_sessions(self, project_id: int, user_id: int) -> List[Dict]:
        try:
            sessions = [
                session for session in self._sessions.values()
                if session["project_id"] == project_id and session["user_id"] == user_id
            ]
            sessions.sort(key=lambda x: x["updated_at"], reverse=True)
            return sessions
        except Exception as e:
            logger.error(f"Error fetching chat sessions: {str(e)}")
            raise

    async def get_messages(self, session_id: str, user_id: int) -> List[Dict]:
        try:
            if session_id not in self._sessions:
                raise ValidationError("Session not found")
            
            if self._sessions[session_id]["user_id"] != user_id:
                raise ValidationError("Unauthorized access to session")

            return self._messages.get(session_id, [])
        except Exception as e:
            logger.error(f"Error fetching chat messages: {str(e)}")
            raise 
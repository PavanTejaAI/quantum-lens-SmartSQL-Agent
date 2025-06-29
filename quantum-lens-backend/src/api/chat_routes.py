from fastapi import APIRouter, Depends, HTTPException
from src.service.auth.auth_middleware import get_current_user
from src.service.chat.chat_service import ChatService
from src.utils.exceptions import ValidationError
from typing import List, Dict
from pydantic import BaseModel

router = APIRouter()
chat_service = ChatService()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    project_id: int

class ChatResponse(BaseModel):
    response: str
    session_id: str

@router.post("/chat/completion", response_model=ChatResponse)
async def get_chat_completion(
    chat_request: ChatRequest,
    current_user = Depends(get_current_user)
):
    try:
        messages = [{"role": msg.role, "content": msg.content} for msg in chat_request.messages]
        response = await chat_service.get_completion(
            messages=messages,
            project_id=chat_request.project_id,
            user_id=current_user["id"]
        )
        return response
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chat/sessions/{project_id}", response_model=List[Dict])
async def get_chat_sessions(
    project_id: int,
    current_user = Depends(get_current_user)
):
    try:
        sessions = await chat_service.get_sessions(
            project_id=project_id,
            user_id=current_user["id"]
        )
        return sessions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chat/messages/{session_id}", response_model=List[ChatMessage])
async def get_chat_messages(
    session_id: str,
    current_user = Depends(get_current_user)
):
    try:
        messages = await chat_service.get_messages(
            session_id=session_id,
            user_id=current_user["id"]
        )
        return messages
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
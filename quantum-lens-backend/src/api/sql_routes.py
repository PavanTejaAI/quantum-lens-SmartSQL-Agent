from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field, validator
import json
import base64
from src.service.auth import get_current_user
from src.service.sql.sql_service import SQLService
from src.service.projects.project_service import ProjectService
from src.llm import OpenRouterClient
from src.utils import logger

router = APIRouter(prefix="/sql", tags=["SQL"])

class SQLRequest(BaseModel):
    message: str = Field(..., min_length=1, description="The SQL query or question")
    project_id: int = Field(..., gt=0, description="The project ID")
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context")
    
    @validator('message')
    def validate_message(cls, v):
        if not v or not v.strip():
            raise ValueError('Message cannot be empty')
        return v.strip()
    
    @validator('project_id')
    def validate_project_id(cls, v):
        if v <= 0:
            raise ValueError('Project ID must be a positive integer')
        return v

def get_sql_service() -> SQLService:
    llm_client = OpenRouterClient.get_instance()
    return SQLService(llm_client)

def get_project_service() -> ProjectService:
    return ProjectService()

@router.post("/process")
async def process_sql_request(
    request: SQLRequest,
    current_user: dict = Depends(get_current_user),
    sql_service: SQLService = Depends(get_sql_service),
    project_service: ProjectService = Depends(get_project_service)
) -> Dict[str, Any]:
    try:
        logger.info(f"Processing SQL request for project {request.project_id}, user {current_user['id']}")
        logger.debug(f"Request message: {request.message}")
        
        project = project_service.get_project(request.project_id, current_user["id"])
        if not project:
            logger.error(f"Project {request.project_id} not found for user {current_user['id']}")
            raise HTTPException(status_code=404, detail="Project not found")

        logger.debug(f"Project found: {project.get('name', 'Unknown')}")

        try:
            encrypted_path = project.get('encrypted_path')
            if not encrypted_path:
                logger.error(f"No encrypted_path found in project {request.project_id}")
                raise ValueError("No encrypted path found")
            
            logger.debug("Decoding project configuration...")
            project_data = json.loads(base64.b64decode(encrypted_path).decode('utf-8'))
            if not project_data or not project_data.get('dbConfig'):
                logger.error(f"Invalid project data format or missing dbConfig for project {request.project_id}")
                logger.debug(f"Decoded project data keys: {list(project_data.keys()) if project_data else 'None'}")
                raise ValueError("Invalid project data format or missing dbConfig")
        except Exception as e:
            logger.error(f"Failed to decode project data for project {request.project_id}: {e}")
            raise HTTPException(status_code=400, detail="Invalid project configuration")

        logger.debug("Getting database schema information...")
        try:
            schema_info = project_service.get_database_info(request.project_id, current_user["id"])
            logger.debug(f"Schema info retrieved: {len(schema_info.get('tables', []))} tables found")
        except Exception as e:
            logger.error(f"Failed to get database info for project {request.project_id}: {e}")
            raise HTTPException(status_code=400, detail=f"Database connection failed: {str(e)}")

        logger.debug("Processing message with SQL service...")
        result = await sql_service.process_message(
            message=request.message,
            project_id=str(request.project_id),
            schema=schema_info,
            context=request.context
        )

        if not result["success"]:
            logger.error(f"SQL service processing failed: {result}")
            raise HTTPException(
                status_code=400,
                detail=result["content"]["error"] if result["type"] == "error" else "Request failed"
            )

        logger.info(f"SQL request processed successfully for project {request.project_id}")
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to process SQL request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 
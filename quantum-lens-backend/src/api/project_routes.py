from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from ..service.auth import get_current_user
from ..service.projects import ProjectService
from ..utils import logger

router = APIRouter(prefix="/projects", tags=["Projects"])
project_service = ProjectService()

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    encrypted_path: str

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    encrypted_path: Optional[str] = None

class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    encrypted_path: str
    created_at: str
    updated_at: str

class TableInfo(BaseModel):
    name: str
    row_count: int
    column_count: int

class DatabaseInfoResponse(BaseModel):
    database_name: str
    tables: List[TableInfo]
    connection_status: bool

@router.post("", response_model=ProjectResponse)
async def create_project(project_data: ProjectCreate, current_user: dict = Depends(get_current_user)):
    try:
        result = project_service.create_project(current_user["id"], project_data.dict())
        return result
    except Exception as e:
        logger.error(f"Project creation failed: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("", response_model=List[ProjectResponse])
async def get_projects(current_user: dict = Depends(get_current_user)):
    try:
        return project_service.get_user_projects(current_user["id"])
    except Exception as e:
        logger.error(f"Failed to fetch projects: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, current_user: dict = Depends(get_current_user)):
    try:
        project = project_service.get_project(project_id, current_user["id"])
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        return project
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch project: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: int, project_data: ProjectUpdate, current_user: dict = Depends(get_current_user)):
    try:
        project = project_service.update_project(project_id, current_user["id"], project_data.dict(exclude_unset=True))
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        return project
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Project update failed: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: int, current_user: dict = Depends(get_current_user)):
    try:
        if not project_service.delete_project(project_id, current_user["id"]):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Project deletion failed: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{project_id}/database-info", response_model=DatabaseInfoResponse)
async def get_database_info(project_id: int, current_user: dict = Depends(get_current_user)):
    try:
        return project_service.get_database_info(project_id, current_user["id"])
    except Exception as e:
        logger.error(f"Failed to fetch database info: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) 
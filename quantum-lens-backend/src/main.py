from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .api.auth_routes import router as auth_router
from .api.project_routes import router as project_router
from .api.chat_routes import router as chat_router
from .api.sql_routes import router as sql_router
from .service.auth.auth_service import AuthService
from .service.projects.project_service import ProjectService
from .service.chat.chat_service import ChatService
from .service.sql.sql_service import SQLService
from .llm import OpenRouterClient
from .utils import logger
import asyncio

app = FastAPI(
    title="Quantum Lens API",
    description="AI-Powered SQL Query Optimization API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

services = {}

@app.on_event("startup")
async def startup_event():
    try:
        llm_client = OpenRouterClient.get_instance()
        services["auth"] = AuthService()
        services["projects"] = ProjectService()
        services["chat"] = ChatService(llm_client)
        services["sql"] = SQLService(llm_client)
        
        services["auth"].init_db()
        services["projects"].init_db()
        
        logger.info("Services initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize services: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    try:
        tasks = []
        for service_name, service in services.items():
            if hasattr(service, "cleanup") and callable(service.cleanup):
                if asyncio.iscoroutinefunction(service.cleanup):
                    tasks.append(asyncio.create_task(service.cleanup()))
                else:
                    service.cleanup()
        
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
            
        services.clear()
        logger.info("Services shutdown completed")
    except Exception as e:
        logger.error(f"Error during shutdown: {str(e)}")

app.include_router(auth_router, prefix="/api/v1")
app.include_router(project_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")
app.include_router(sql_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Quantum Lens API",
        "version": "1.0.0"
    } 
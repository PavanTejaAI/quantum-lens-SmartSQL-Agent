from fastapi import Request, status
from fastapi.responses import JSONResponse
from src.utils import logger

class AppException(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail

async def global_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, AppException):
        logger.error(f"Application error: {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )
    
    logger.error(f"Unhandled error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"}
    )

class DatabaseError(AppException):
    def __init__(self, detail: str):
        super().__init__(status.HTTP_500_INTERNAL_SERVER_ERROR, detail)

class AuthenticationError(AppException):
    def __init__(self, detail: str):
        super().__init__(status.HTTP_401_UNAUTHORIZED, detail)

class ValidationError(AppException):
    def __init__(self, detail: str):
        super().__init__(status.HTTP_400_BAD_REQUEST, detail) 
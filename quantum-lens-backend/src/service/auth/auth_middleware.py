from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from src.service.auth.auth_service import AuthService
from src.utils import logger

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
auth_service = AuthService()

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    FastAPI dependency to get the current authenticated user from the JWT token.
    This replaces the Flask @require_auth decorator with FastAPI's dependency injection.
    """
    user = auth_service.verify_token(token)
    if not user:
        logger.warning("Authentication failed: Invalid token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user 
from fastapi import APIRouter, Depends, HTTPException
from app.models.settings import UserSettingsResponse, PreferencesUpdate
from app.services.settings_service import SettingsService
from app.core.dependencies import get_settings_service, get_current_user_id

router = APIRouter(tags=["settings"])

@router.get("/me", response_model=UserSettingsResponse)
def get_my_settings(
    service: SettingsService = Depends(get_settings_service),
    current_user: str = Depends(get_current_user_id)
):
    """Retrieves the settings for the currently authenticated IT Specialist."""
    try:
        return service.get_my_settings(current_user)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.patch("/me", response_model=UserSettingsResponse)
def update_my_preferences(
    body: PreferencesUpdate,
    service: SettingsService = Depends(get_settings_service),
    current_user: str = Depends(get_current_user_id)
):
    """Updates the specialist's preferences."""
    try:
        return service.update_my_preferences(current_user, body)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

from repositories.settings_repository import SettingsRepository
from models.settings import UserSettingsResponse, UserSettings, PreferencesUpdate

class SettingsService:
    """
    Business Logic Layer for Settings.
    """
    def __init__(self, repository: SettingsRepository):
        self.repository = repository

    def get_my_settings(self, user_id: str) -> UserSettingsResponse:
        db_settings = self.repository.get_by_user_id(user_id)
        if not db_settings:
            raise ValueError("User settings not found")
            
        return UserSettingsResponse(data=UserSettings.model_validate(db_settings))

    def update_my_preferences(self, user_id: str, prefs_update: PreferencesUpdate) -> UserSettingsResponse:
        db_settings = self.repository.update_preferences(user_id, prefs_update.preferences)
        if not db_settings:
            raise ValueError("User settings not found")
            
        return UserSettingsResponse(data=UserSettings.model_validate(db_settings))

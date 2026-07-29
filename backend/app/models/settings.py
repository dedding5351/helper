from pydantic import BaseModel, ConfigDict
from sqlalchemy import Column, String, Text
from core.database import Base
import json

# --- SQLAlchemy DB Models ---

class UserSettingsDB(Base):
    __tablename__ = "user_settings"

    id = Column(String, primary_key=True, index=True) # UUID or string ID
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    preferences_json = Column(Text, nullable=True) # Stores JSON


# --- Pydantic Models ---

class UserPreferences(BaseModel):
    compactQueueDensity: bool = False
    showAiConfidenceScores: bool = False

class UserSettings(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    fullName: str
    email: str
    preferences: UserPreferences

    @classmethod
    def model_validate(cls, obj, *args, **kwargs):
        if isinstance(obj, UserSettingsDB):
            prefs = UserPreferences()
            if obj.preferences_json:
                try:
                    prefs_dict = json.loads(obj.preferences_json)
                    prefs = UserPreferences(**prefs_dict)
                except (json.JSONDecodeError, TypeError):
                    pass
            
            return cls(
                fullName=obj.full_name,
                email=obj.email,
                preferences=prefs
            )
        return super().model_validate(obj, *args, **kwargs)

class UserSettingsResponse(BaseModel):
    data: UserSettings

class PreferencesUpdate(BaseModel):
    preferences: dict

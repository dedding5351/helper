from typing import Optional
from sqlalchemy.orm import Session
from app.models.settings import UserSettingsDB
import json

class SettingsRepository:
    """
    Data Access Layer for Settings.
    """
    def __init__(self, db: Session):
        self.db = db

    def get_by_user_id(self, user_id: str) -> Optional[UserSettingsDB]:
        return self.db.query(UserSettingsDB).filter(UserSettingsDB.id == user_id).first()

    def update_preferences(self, user_id: str, new_prefs: dict) -> Optional[UserSettingsDB]:
        db_settings = self.get_by_user_id(user_id)
        if not db_settings:
            return None
            
        current_prefs = {}
        if db_settings.preferences_json:
            try:
                current_prefs = json.loads(db_settings.preferences_json)
            except json.JSONDecodeError:
                pass
                
        # Merge new preferences
        current_prefs.update(new_prefs)
        db_settings.preferences_json = json.dumps(current_prefs)
        
        self.db.commit()
        self.db.refresh(db_settings)
        return db_settings

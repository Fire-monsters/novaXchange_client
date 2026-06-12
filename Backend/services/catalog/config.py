from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_env: str = "development"
    app_port: int = 8001
    base_url: str = "http://localhost:8001"

    mongo_uri: str = "mongodb://localhost:27017/novaxchange"
    mongo_db_name: str = "novaxchange"

    r2_account_id: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_bucket_name: str = "novaxchange-products"
    r2_public_url: str = ""

    local_upload_dir: str = "./uploads/products"
    image_source: str = "r2"

    jwt_secret: str = "dev-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    # Admin credentials — set these in .env before first run
    # Generate hash: python -c "from passlib.hash import bcrypt; print(bcrypt.hash('yourpw'))"
    admin_email: str = "admin@novaxchange.xyz"
    admin_password_hash: str = "$2b$12$placeholder_replace_this_with_real_hash"

    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
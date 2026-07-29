from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings  # type: ignore

SERVICE_ROOT = Path(__file__).resolve().parent


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
    r2_public_url: str = "https://pub-5b965219b7644024b0894c7005c8c3e2.r2.dev"

    local_upload_dir: str = "./uploads/products"
    image_source: str = "r2"

    jwt_secret: str = "dev-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    # Separate secret from admin's jwt_secret — a customer token must never
    # verify against the admin dependency, or vice versa.
    customer_jwt_secret: str = "dev-customer-secret-change-in-production"
    customer_jwt_expire_minutes: int = 43200  # 30 days

    # Supabase project — used only to verify a Google-auth access token
    # server-side (GET /auth/v1/user). Blank means Google sign-in is disabled.
    supabase_url: str = ""
    supabase_anon_key: str = ""

    # Admin credentials — set these in .env before first run
    # Set ADMIN_PASSWORD for a simple startup flow, or ADMIN_PASSWORD_HASH if you already generated a bcrypt hash.
    admin_email: str = "admin@novaxchange.xyz"
    admin_password: str = ""
    admin_password_hash: str = "$2b$12$placeholder_replace_this_with_real_hash"
    admin_accounts_file: str = "./data/admin_accounts.json"

    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_from_email: str = ""
    smtp_use_tls: bool = True

    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    class Config:
        # Resolved relative to this file, not the process's cwd — otherwise
        # starting the service from a different working directory (a process
        # manager, a different `cwd` in systemd, running uvicorn from a parent
        # dir) silently loads no .env at all and every setting falls back to
        # its (often blank) default with no error.
        env_file = SERVICE_ROOT / ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
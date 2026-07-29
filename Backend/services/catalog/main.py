import logging
import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # pyright: ignore[reportMissingImports]

SERVICE_ROOT = Path(__file__).resolve().parent.parent
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

from catalog.config import get_settings
from catalog.database import connect_db, close_db
from catalog.routers import products, categories, admin_auth, customer_auth, orders, store_settings
from catalog.storage import check_r2_config

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger("catalog.main")

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    for problem in check_r2_config():
        logger.warning("R2 config problem: %s", problem)
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="novaXchange Catalog Service",
    version="0.1.0",
    docs_url="/docs" if not settings.is_production else None,
    redoc_url=None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers — all live under /api/catalog/ via Nginx proxy
app.include_router(admin_auth.router)
app.include_router(customer_auth.router)
app.include_router(customer_auth.admin_router)
app.include_router(orders.router)
app.include_router(store_settings.router)
app.include_router(store_settings.admin_router)
app.include_router(products.router)
app.include_router(categories.router)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "catalog",
        "image_source": settings.image_source,
        "env": settings.app_env,
    }
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from catalog.config import get_settings
from catalog.database import connect_db, close_db
from catalog.routers import products, categories, admin_auth

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
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
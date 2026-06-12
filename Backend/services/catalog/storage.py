"""
storage.py — image storage module
──────────────────────────────────────────────────────────────────────
Primary:  Cloudflare R2 (boto3 S3-compatible)
Backup:   Local VPS disk (commented out — uncomment to enable dual-write)
──────────────────────────────────────────────────────────────────────
"""

import asyncio
import io
import uuid
from pathlib import Path

import aioboto3
import aiofiles
from PIL import Image, ImageOps

from catalog.config import get_settings

settings = get_settings()


def compress_to_webp(raw_bytes: bytes, max_width: int = 1200, max_height: int = 1200, quality: int = 82) -> bytes:
    """Compress any image to WebP, resize to max dimensions, strip EXIF."""
    img = Image.open(io.BytesIO(raw_bytes))
    img = ImageOps.exif_transpose(img)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")
    img.thumbnail((max_width, max_height), Image.LANCZOS)
    output = io.BytesIO()
    img.save(output, format="WEBP", quality=quality, method=4)
    return output.getvalue()


def _r2_endpoint() -> str:
    return f"https://{settings.r2_account_id}.r2.cloudflarestorage.com"


def _get_r2_session() -> aioboto3.Session:
    return aioboto3.Session(
        aws_access_key_id=settings.r2_access_key_id,
        aws_secret_access_key=settings.r2_secret_access_key,
        region_name="auto",
    )


async def upload_to_r2(filename: str, webp_bytes: bytes) -> str:
    key = f"products/{filename}"
    session = _get_r2_session()
    async with session.client("s3", endpoint_url=_r2_endpoint()) as s3:
        await s3.put_object(
            Bucket=settings.r2_bucket_name,
            Key=key,
            Body=webp_bytes,
            ContentType="image/webp",
            CacheControl="public, max-age=31536000, immutable",
        )
    return f"{settings.r2_public_url}/{key}"


async def save_to_disk(filename: str, webp_bytes: bytes) -> None:
    """VPS local backup — called only when dual-write is enabled."""
    upload_dir = Path(settings.local_upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    async with aiofiles.open(upload_dir / filename, "wb") as f:
        await f.write(webp_bytes)


async def delete_from_r2(filename: str) -> None:
    key = f"products/{filename}"
    session = _get_r2_session()
    async with session.client("s3", endpoint_url=_r2_endpoint()) as s3:
        await s3.delete_object(Bucket=settings.r2_bucket_name, Key=key)


async def delete_from_disk(filename: str) -> None:
    path = Path(settings.local_upload_dir) / filename
    if path.exists():
        path.unlink()


def get_image_url(filename: str) -> str:
    """Flip between R2 and local URLs via IMAGE_SOURCE env var."""
    if settings.image_source == "local":
        return f"{settings.base_url}/uploads/products/{filename}"
    return f"{settings.r2_public_url}/products/{filename}"


async def process_and_store_image(raw_bytes: bytes, product_slug: str) -> dict:
    webp_bytes = compress_to_webp(raw_bytes)
    filename = f"{product_slug}-{uuid.uuid4().hex[:8]}.webp"

    # PRIMARY: upload to R2
    url = await upload_to_r2(filename, webp_bytes)

    # BACKUP: uncomment below to enable dual-write to VPS disk
    # await asyncio.gather(
    #     upload_to_r2(filename, webp_bytes),
    #     save_to_disk(filename, webp_bytes),
    # )

    return {"filename": filename, "url": url, "size_kb": round(len(webp_bytes) / 1024)}


async def store_product_images(raw_files: list[tuple[bytes, str]], product_slug: str) -> list[dict]:
    """Upload multiple images in parallel — total time = slowest single upload."""
    tasks = [process_and_store_image(raw_bytes, product_slug) for raw_bytes, _ in raw_files]
    return await asyncio.gather(*tasks)


async def delete_product_images(filenames: list[str]) -> None:
    await asyncio.gather(*[delete_from_r2(f) for f in filenames])
    # Uncomment for dual-write cleanup:
    # await asyncio.gather(*[delete_from_disk(f) for f in filenames])
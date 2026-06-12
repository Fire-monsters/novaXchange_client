from motor.motor_asyncio import AsyncIOMotorClient
from catalog.config import get_settings

settings = get_settings()
client: AsyncIOMotorClient = None
db = None

async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.mongo_uri)
    db = client[settings.mongo_db_name]
    # text index for search
    await db.products.create_index([("name", "text"), ("description", "text"), ("short_description", "text")])

async def close_db():
    client.close()

async def get_db():
    return db
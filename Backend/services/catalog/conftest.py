import os
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

import pymongo
import pytest

# Admin auth bootstraps its account store during module import. Keep that test
# side effect out of the repository (and away from any real admin account file).
TEST_ADMIN_ACCOUNTS_FILE = (
    Path(tempfile.gettempdir()) / f"novaxchange-pytest-admin-{os.getpid()}.json"
)
os.environ["ADMIN_ACCOUNTS_FILE"] = str(TEST_ADMIN_ACCOUNTS_FILE)

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


MONGO_URI = "mongodb://localhost:27017"


def _mongo_is_ready() -> bool:
    client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=500)
    try:
        client.admin.command("ping")
        return True
    except pymongo.errors.PyMongoError:
        return False
    finally:
        client.close()


@pytest.fixture(scope="session", autouse=True)
def ensure_test_mongodb(tmp_path_factory):
    """Use an existing local MongoDB or start a disposable one for the suite."""
    mongod_process = None
    log_handle = None
    try:
        if not _mongo_is_ready():
            mongod = shutil.which("mongod")
            if mongod is None:
                pytest.fail(
                    "MongoDB is not available at localhost:27017 and 'mongod' is "
                    "not installed. Start MongoDB before running the backend tests."
                )

            db_path = tmp_path_factory.mktemp("mongodb")
            log_path = db_path / "mongod.log"
            log_handle = log_path.open("w")
            mongod_process = subprocess.Popen(
                [
                    mongod,
                    "--dbpath",
                    str(db_path),
                    "--bind_ip",
                    "127.0.0.1",
                    "--port",
                    "27017",
                    "--quiet",
                ],
                stdout=log_handle,
                stderr=subprocess.STDOUT,
            )

            deadline = time.monotonic() + 10
            while time.monotonic() < deadline:
                if _mongo_is_ready() or mongod_process.poll() is not None:
                    break
                time.sleep(0.1)

            if not _mongo_is_ready():
                log_handle.flush()
                details = log_path.read_text(errors="replace")
                pytest.fail(f"Could not start the temporary MongoDB:\n{details}")

        yield
    finally:
        if mongod_process is not None and mongod_process.poll() is None:
            mongod_process.terminate()
            try:
                mongod_process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                mongod_process.kill()
                mongod_process.wait(timeout=5)
        if log_handle is not None:
            log_handle.close()
        TEST_ADMIN_ACCOUNTS_FILE.unlink(missing_ok=True)

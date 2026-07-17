"""
Environment configuration module for Django settings.
Handles loading and parsing environment variables with proper defaults.
"""
from dotenv import load_dotenv
import os
from pathlib import Path

# 1. Resolve .env file location
# This finds the .env in the backend directory regardless of where you run the project from.
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / '.env'

# 2. Load environment variables
load_dotenv(dotenv_path=env_path, override=True)

# 3. Environment Detection
# Explicitly set ENVIRONMENT in .env or via environment variable
# Priority: ENVIRONMENT env var > 'development' (default)
ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()

# Check if we are running inside a Docker container
# Only true if explicitly set or /.dockerenv exists
IS_DOCKER = os.path.exists('/.dockerenv') or os.getenv("RUNNING_ON_DOCKER", "false").lower() == "true"

# 4. Database Selection Logic
LOCAL_DB = os.getenv("LOCAL_DB")
DOCKER_DB = os.getenv("DOCKER_DB")
PRODUCTION_DB = os.getenv("PRODUCTION_DB")

# 5. Core Application Settings
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

# 6. Third Party Integrations
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")
RESEND_API_KEY = os.getenv("RESEND_API_KEY")

# 7. Notification Server Settings
QSTACK_NOTIFICATION_API_KEY = os.getenv("QSTACK_NOTIFICATION_API_KEY")
QSTACK_NOTIFICATION_SERVER_URL = os.getenv("QSTACK_NOTIFICATION_SERVER_URL")

# Load and parse ALLOWED_ORIGINS

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
CSRF_TRUSTED_ORIGINS = os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")

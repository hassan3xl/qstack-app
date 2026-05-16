from .base import *
import os
import dj_database_url

DEBUG = False

from settings.config import (
    ALLOWED_HOSTS,
    PRODUCTION_DB,
    SECRET_KEY,
)

# Parse environment for CSRF trusted origins
CSRF_TRUSTED_ORIGINS_STR = os.getenv("CSRF_TRUSTED_ORIGINS", "")
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in CSRF_TRUSTED_ORIGINS_STR.split(",") if origin.strip()]

# Parse environment for allowed origins
ALLOWED_ORIGINS_STR = os.getenv("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS_LIST = [origin.strip() for origin in ALLOWED_ORIGINS_STR.split(",") if origin.strip()]

ALLOWED_HOSTS = ALLOWED_HOSTS
SECRET_KEY = SECRET_KEY

# CORS Configuration for production
CORS_ALLOWED_ORIGINS = ALLOWED_ORIGINS_LIST
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

DATABASES = {
    "default": dj_database_url.parse(PRODUCTION_DB, conn_max_age=600) 
}

# Free-tier friendly cache
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}

LOGGING = {
    "version": 1,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
    },
    "root": {
        "handlers": ["console"],
        "level": "DEBUG",
    },
}

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")

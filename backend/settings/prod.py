from .base import *
import os
import dj_database_url

DEBUG = False

from settings.config import (
    ALLOWED_HOSTS,
    PRODUCTION_DB,
    SECRET_KEY,
    CSRF_TRUSTED_ORIGINS,
    ALLOWED_ORIGINS,
)

# Parse environment for CSRF trusted origins

# Parse environment for allowed origins
ALLOWED_ORIGINS_STR = os.getenv("ALLOWED_ORIGINS", "")
CSRF_TRUSTED_ORIGINS = CSRF_TRUSTED_ORIGINS
ALLOWED_HOSTS = ALLOWED_HOSTS
SECRET_KEY = SECRET_KEY
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
# CORS Configuration for production
CORS_ALLOWED_ORIGINS = ALLOWED_ORIGINS
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
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'DEBUG',  # captures every request + errors
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'WARNING',  # set to DEBUG to see every SQL query
            'propagate': False,
        },
    },
}


# Production caching configuration using Redis (Render)
redis_url = os.environ.get("REDIS_URL")
if redis_url:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.redis.RedisCache",
            "LOCATION": redis_url,
        }
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        }
    }

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")

# Add trusted domains for CSRF and allowed hosts
ALLOWED_HOSTS += ['app.qstack.com.ng', 'qstack-app.onrender.com']
CSRF_TRUSTED_ORIGINS += ['https://app.qstack.com.ng', 'https://qstack-app.onrender.com']

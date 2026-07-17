from dj_database_url import parse

from .base import *
import os

DEBUG = True
import socket
hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
INTERNAL_IPS = [ip[:-1] + "1" for ip in ips] + ["127.0.0.1"]
# SECRET_KEY = os.environ["SECRET_KEY"]
SECRET_KEY="dasdaskdaskdjasds"


from settings.config import (
    ALLOWED_ORIGINS, ALLOWED_HOSTS, PRODUCTION_DB, 
)


ALLOWED_HOSTS = ALLOWED_HOSTS
ALLOWED_ORIGINS = ALLOWED_ORIGINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    },
    # "default": parse(PRODUCTION_DB, conn_max_age=600)

}

STORAGES = {
    # Media: Goes to Cloudinary
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    
    # Static: Stays local (or use WhiteNoise in production)
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}


# CACHES = {
#     "default": {
#         "BACKEND": "django_redis.cache.RedisCache",
#         "LOCATION": os.getenv("REDIS_URL", "redis://redis:6379/1"),
#         "OPTIONS": {
#             "CLIENT_CLASS": "django_redis.client.DefaultClient",
#         },
#     }
# }

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"


# Override cloudinary_storage's collectstatic command.
# cloudinary_storage hijacks collectstatic to upload to Cloudinary, but we
# store static files locally (served by WhiteNoise). This re-exports Django's
# built-in Command so normal local collection happens.
from django.contrib.staticfiles.management.commands.collectstatic import Command

__all__ = ["Command"]

#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

if [ "$DJANGO_ENV" != "production" ]; then
  echo "Waiting for database..."
  DB_HOST=${DB_HOST:-db}
  DB_PORT=${DB_PORT:-5432}

  if command -v nc >/dev/null 2>&1; then
    while ! nc -z $DB_HOST $DB_PORT; do
      echo "Database not ready, waiting..."
      sleep 1
    done
  else  
    echo "nc not found, sleeping for 5s..."
    sleep 5
  fi

  echo "Database is ready!"
fi

# Set settings module for production
if [ "$DJANGO_ENV" = "production" ]; then
  export DJANGO_SETTINGS_MODULE=settings.prod
fi

# Helper to run python commands (prefers uv if available)
run_python() {
  if command -v uv >/dev/null 2>&1; then
    uv run python "$@"
  else
    python "$@"
  fi
}

# Run migrations
echo "Running migrations..."
run_python manage.py migrate --noinput

if [ "$DJANGO_ENV" = "production" ]; then
  echo "Running in PRODUCTION mode"

  echo "Collecting static files..."
  run_python manage.py collectstatic --noinput

  echo "Starting Gunicorn..."
  if command -v uv >/dev/null 2>&1; then
    exec uv run gunicorn src.wsgi:application \
        --bind 0.0.0.0:${PORT:-8000} \
        --workers 1 \
        --threads 2 \
        --timeout 120 \
        --access-logfile - \
        --error-logfile - \
        --log-level info
  else
    exec gunicorn src.wsgi:application \
        --bind 0.0.0.0:${PORT:-8000} \
        --workers 1 \
        --threads 2 \
        --timeout 120 \
        --access-logfile - \
        --error-logfile - \
        --log-level info
  fi
else
  echo "Running in DEVELOPMENT mode"
  
  echo "Starting Django development server..."
  if command -v uv >/dev/null 2>&1; then
    exec uv run python manage.py runserver 0.0.0.0:8000
  else
    exec python manage.py runserver 0.0.0.0:8000
  fi
fi
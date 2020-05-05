export FLASK_ENV="production"
export FLASK_APP="backend"
service nginx start
/etc/init.d/fcgiwrap start && chown www-data:www-data /var/run/fcgiwrap.socket
echo $FLASK_ENV
gunicorn backend.wsgi:app --workers 8 --bind 0.0.0.0:8000 --timeout 500 --enable-stdio-inheritance
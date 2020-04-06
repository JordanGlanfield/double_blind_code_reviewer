#! /bin/bash

gunicorn tapp.wsgi:app \
           --workers 8 \
           --bind 0.0.0.0:8000 \
           --timeout 500\
           --log-file $HOME/tapp.log \
           --log-level debug \
           --capture-output \
           --enable-stdio-inheritance
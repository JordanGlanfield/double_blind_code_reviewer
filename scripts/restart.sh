#! /bin/bash

export PATH=$PWD/venv/bin:$PATH

if ! pgrep -x "gunicorn" > /dev/null
then
  gunicorn backend.wsgi:app \
           --workers 8 \
           --bind 0.0.0.0:8000 \
           --timeout 500\
           --log-file $HOME/tapp.log \
           --log-level debug \
           --capture-output \
           --enable-stdio-inheritance \
           --daemon
else
  sudo killall -HUP gunicorn
fi



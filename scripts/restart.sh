#! /bin/bash

export PATH=$PWD/venv/bin:$PATH

if ! pgrep -x "gunicorn" > /dev/null
then
  /bin/bash ./start_gunicorn.sh
else
  sudo killall -HUP gunicorn
fi

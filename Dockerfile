FROM python:3.7.7-buster

SHELL ["/bin/bash", "-c"]

WORKDIR /dbcr

# TODO - disable nginx default page
# TODO - investigate permissions of generated files

# Set up nginx
RUN apt-get update && apt-get -y install nginx

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/sites-available/ /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/dbcr.com /etc/nginx/sites-enabled/

# Set up git server

COPY nginx/htpasswd git/
RUN apt-get install git fcgiwrap apache2-utils -y && \
    git config --global receive.denyCurrentBranch updateInstead

# Build frontend
COPY frontend/ frontend/
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get -y install yarn && \
    yarn --cwd frontend install && \
    yarn --cwd frontend build

# Set up backend
COPY tapp/ backend/
COPY requirements.txt .
RUN apt-get -y install libsasl2-dev python-dev libldap2-dev libssl-dev
RUN python3 -m venv venv && source venv/bin/activate
RUN pip install --upgrade pip && pip install -r requirements.txt

RUN nginx

# TODO - multi stage build. Look at what is actually used in final run and what is simply
# an artifact of the build process.

COPY scripts/ scripts/

CMD ["./scripts/start_gunicorn.sh"]

EXPOSE 80
FROM alpine AS frontend

RUN apk add yarn

COPY frontend/package.json frontend/

RUN cd frontend/ && \
    yarn install

COPY frontend/ frontend/
RUN cd frontend/ && \
    yarn build

FROM python:3.7.7-buster AS git_build



###################################################
FROM python:3.7.7-buster AS setup

SHELL ["/bin/bash", "-c"]

WORKDIR /dbcr

# Set up nginx and git server
RUN apt-get update && apt-get -y install nginx && \
    apt-get -y install fcgiwrap apache2-utils software-properties-common ca-certificates

# Set up python virtual environment
RUN apt-get update && apt-get -y install libsasl2-dev python-dev libldap2-dev libssl-dev sqlite3 && \
    python3 -m venv venv && source venv/bin/activate

RUN apt-get update && \
    apt-get -y remove git && \
    apt-get -y install make libssl-dev libghc-zlib-dev libcurl4-gnutls-dev libexpat1-dev gettext unzip && \
    wget https://github.com/git/git/archive/v2.26.1.zip -O git.zip && \
    unzip git.zip && \
    cd git-2.26.1 && \
    make prefix=/usr/local all && \
    make prefix=/usr/local install && \
    cd .. && \
    rm git.zip && \
    rm -rf git-2.26.1 && \
    git config --global receive.denyCurrentBranch updateInstead

# Set up persistence volume. TODO: move this to a later stage
RUN mkdir storage && \
    mkdir storage/repos && \
    mkdir storage/migrations && \
    mkdir storage/migrations/versions

COPY migrations_prod/alembic.ini storage/migrations
COPY migrations_prod/env.py storage/migrations
COPY migrations_prod/script.py.mako storage/migrations

VOLUME storage

##################################################
FROM setup AS final

# Install backend dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY backend backend/
COPY scripts/dev_exports.sh scripts/

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/sites-available/ /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/dbcr.com /etc/nginx/sites-enabled/ && \
    rm /etc/nginx/sites-enabled/default

# Add start up script
COPY scripts/start.sh .

RUN mkdir /dbcr/logs/


# Include frontend
COPY --from=frontend build/ build/

EXPOSE 80

CMD ["sh", "-c", "./start.sh"]
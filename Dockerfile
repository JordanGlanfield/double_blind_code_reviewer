FROM alpine AS frontend

RUN apk add yarn

COPY frontend/package.json frontend/

RUN cd frontend/ && \
    yarn install

COPY frontend/ frontend/
RUN cd frontend/ && \
    yarn build

#FROM buster AS git_build
#
#RUN apt update && apt-get -y install make libssl-dev libghc-zlib-dev libcurl4-gnutls-dev libexpat1-dev gettext unzip && \
#    wget https://github.com/git/git/archive/v2.26.1.zip -O git.zip && \
#    unzip git.zip && \
#    cd git-2.26.1 && \
#    make prefix=/usr/local all && \
#    make prefix=/usr/local install


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
#    add-apt-repository -y ppa:git-core/ppa && \
    apt-get -y install git && \
    git config --global receive.denyCurrentBranch updateInstead

# Set up persistence volume. TODO: move this to a later stage
RUN mkdir storage && \
    mkdir storage/repos

VOLUME storage

##################################################
FROM setup AS final

# Install backend dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY backend backend/
COPY migrations migrations/
COPY scripts/dev_exports.sh scripts/

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/sites-available/ /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/dbcr.com /etc/nginx/sites-enabled/ && \
    rm /etc/nginx/sites-enabled/default

# Add start up script
COPY scripts/start.sh .

# Run database migrations
RUN export FLASK_APP=backend && \
    export FLASK_ENV=production && \
    mkdir /dbcr/logs/ && \
    flask db migrate && \
    flask db upgrade


# Include frontend
COPY --from=frontend build/ build/

EXPOSE 80

CMD ["sh", "-c", "./start.sh"]
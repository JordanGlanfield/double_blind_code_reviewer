FROM ubuntu AS frontend

COPY frontend/ frontend/
RUN apt-get update && apt-get -y install curl gnupg2 && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get -y install yarn && \
    cd frontend/ && \
    yarn install && \
    yarn build

FROM python:3.7.7-buster AS backend

SHELL ["/bin/bash", "-c"]

WORKDIR /dbcr

# Set up backend
RUN apt-get update && apt-get -y install libsasl2-dev python-dev libldap2-dev libssl-dev && \
    python3 -m venv venv && source venv/bin/activate

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY backend backend/

FROM backend AS nginx

# Set up nginx and git server
RUN apt-get update && apt-get -y install nginx && \
    apt-get install git fcgiwrap apache2-utils -y && \
    git config --global receive.denyCurrentBranch updateInstead

FROM nginx AS config

COPY nginx/htpasswd git/

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/sites-available/ /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/dbcr.com /etc/nginx/sites-enabled/ && \
    rm /etc/nginx/sites-enabled/default

COPY scripts/start.sh .

COPY --from=frontend frontend/build build/

EXPOSE 80

CMD ["sh", "-c", "./start.sh"]
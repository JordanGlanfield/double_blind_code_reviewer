FROM ubuntu

WORKDIR /dbcr

# TODO - disable nginx default page
# TODO - investigate permissions of generated files

# Set up nginx
RUN apt-get update && apt-get install nginx

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/sites-available/ /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/dbcr.com /etc/nginx/sites-enabled/ && \
    ln -s /etc/nginx/sites-available/dbcrgit.com /etc/nginx/sites-enabled/

# Set up git server

COPY nginx/htpasswd git/
RUN apt-get install git fcgiwrap apache2-utils -y && \
    git config --global receive.denyCurrentBranch updateInstead

# Build frontend
COPY frontend/ frontend/
RUN yarn --cwd frontend build

# Set up backend
COPY tapp/ backend/
COPY scripts/ scripts/
RUN python3 -m venv venv && source venv/bin/activate
RUN pip install --upgrade pip && pip install -r requirements.txt

RUN systemctl restart nginx

# TODO - multi stage build

CMD ["source", "scripts/restart.sh"]

EXPOSE 80
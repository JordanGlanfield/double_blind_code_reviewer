gzip_http_version 1.0;
gzip_proxied      any;
gzip_min_length   500;
gzip_disable      "MSIE [1-6]\.";
gzip_types        text/plain text/xml text/css
                  text/comma-separated-values
                  text/javascript
                  application/x-javascript
                  application/atom+xml;

# Configuration containing list of application servers
upstream app_servers {

    server 127.0.0.1:8000;
    # server 127.0.0.1:8081;
    # ..
    # .

}

# Configuration for Nginx
server {

    # Running port
    listen 80;

    server_name dbcr.org.uk www.dbcr.org.uk dbcr.com;

    root /dbcr/backend/repos;

    # Settings to serve static files
    # location /static  {
    #   try_files $uri $uri/ =404;
    # }

    # Git server
    location ~ (/*/\.git/) {
        auth_basic "Git Operations";
        auth_basic_user_file /dbcr/storage/.htpasswd;
        auth_request /check_auth;

      client_max_body_size 0; # Git pushes can be massive, just to make sure nginx doesn't suddenly cut the connection add this.
      include /etc/nginx/fastcgi_params; # Include the default fastcgi configs
      fastcgi_param SCRIPT_FILENAME /usr/lib/git-core/git-http-backend; # Tells fastcgi to pass the request to the git http backend executable
      fastcgi_param GIT_HTTP_EXPORT_ALL "";
      fastcgi_param GIT_PROJECT_ROOT /dbcr/storage/repos; # Location of all git repositories.
      fastcgi_param REMOTE_USER $remote_user;
      fastcgi_param PATH_INFO $uri; # Takes the capture group from our location directive and gives git that.
      fastcgi_pass  unix:/var/run/fcgiwrap.socket; # Pass the request to fastcgi
    }

    location /check_auth {
        internal;
        proxy_pass http://app_servers/api/v1.0/repos/check_auth;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
        proxy_set_header X-Original-URI $request_uri;
        proxy_set_header Username $remote_user;
    }

    # Forward to application servers using app_servers
    location / {
      proxy_pass         http://app_servers;
      proxy_redirect     off;
      proxy_set_header   Host $host;
      proxy_set_header   X-Real-IP $remote_addr;
      proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header   X-Forwarded-Host $server_name;
    }

    # location / {
      # First attempt to serve request as file, then
      # as directory, then fall back to displaying a 404.
      # try_files $uri $uri/ =404;
    # }
}

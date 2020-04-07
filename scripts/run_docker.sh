docker build --tag dbcr:1.0 .
docker stop dbcr
docker rm dbcr
docker run --publish 80:80 --detach --name dbcr dbcr:1.0
docker logs dbcr
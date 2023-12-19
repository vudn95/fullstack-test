ROOT_DIR:=$(shell pwd)
INFRA:=${ROOT_DIR}/docker/infra
SERVICES:=${ROOT_DIR}/docker/services

SERVICEGROUPS=backend frontend

start-all: setup-infra
	@for service in ${SERVICEGROUPS}; do \
		ROOT_DIR=${ROOT_DIR} docker-compose -f ${SERVICES}/$$service/docker-compose.yml --env-file ${ROOT_DIR}/$$service/.env up --build -d; \
	done
start: setup-infra ## Start services with list of service names; i.e: "make start service=app container=nestjs-api"
	@set -e && \
	if [ -f ${SERVICES}/$(service)/docker-compose.yml ]; then \
		echo "Starting $$service service ..."; \
    ROOT_DIR=${ROOT_DIR} docker-compose -f ${SERVICES}/$(service)/docker-compose.yml --env-file ${ROOT_DIR}/${service}/.env up --build -d $(container); \
	else \
  	echo "Service $$service not found"; \
  	exit 1;	\
	fi;



# ------------------
# Setup infra
# ------------------
setup-infra:
	@docker-compose -f ${INFRA}/docker-compose.yml up -d

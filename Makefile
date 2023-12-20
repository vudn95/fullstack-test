ROOT_DIR:=$(shell pwd)
INFRA:=${ROOT_DIR}/docker/infra
SERVICES:=${ROOT_DIR}/docker/services

SERVICEGROUPS=backend frontend

start-all: setup-infra
	@for service in ${SERVICEGROUPS}; do \
		ROOT_DIR=${ROOT_DIR} docker-compose -f ${SERVICES}/$$service/docker-compose.yml --env-file ${ROOT_DIR}/$$service/.env up -d; \
	done
	migrate

restart-all: setup-infra
	@for service in ${SERVICEGROUPS}; do \
		ROOT_DIR=${ROOT_DIR} docker-compose -f ${SERVICES}/$$service/docker-compose.yml --env-file ${ROOT_DIR}/$$service/.env up --build -d; \
	done
	migrate

stop-all: setup-infra
	@for service in ${SERVICEGROUPS}; do \
		ROOT_DIR=${ROOT_DIR} docker-compose -f ${SERVICES}/$$service/docker-compose.yml --env-file ${ROOT_DIR}/$$service/.env stop; \
	done

start: setup-infra ## Start services with list of service names; i.e: "make start service=app container=nestjs-api"
	@set -e && \
	if [ -f ${SERVICES}/$(service)/docker-compose.yml ]; then \
		echo "Starting $$service service ..."; \
    ROOT_DIR=${ROOT_DIR} docker-compose -f ${SERVICES}/$(service)/docker-compose.yml --env-file ${ROOT_DIR}/${service}/.env up -d $(container); \
	else \
  	echo "Service $$service not found"; \
  	exit 1;	\
	fi;


restart: setup-infra ## Start services with list of service names; i.e: "make start service=app container=nestjs-api"
	@set -e && \
	if [ -f ${SERVICES}/$(service)/docker-compose.yml ]; then \
		echo "Restarting $$service service ..."; \
    ROOT_DIR=${ROOT_DIR} docker-compose -f ${SERVICES}/$(service)/docker-compose.yml --env-file ${ROOT_DIR}/${service}/.env up --build -d $(container); \
	else \
  	echo "Service $$service not found"; \
  	exit 1;	\
	fi;

stop: setup-infra ## Start services with list of service names; i.e: "make start service=app container=nestjs-api"
	@set -e && \
	if [ -f ${SERVICES}/$(service)/docker-compose.yml ]; then \
		echo "Stopping $$service service ..."; \
    ROOT_DIR=${ROOT_DIR} docker-compose -f ${SERVICES}/$(service)/docker-compose.yml --env-file ${ROOT_DIR}/${service}/.env stop -d $(container); \
	else \
  	echo "Service $$service not found"; \
  	exit 1;	\
	fi;

# ------------------
# Setup infra
# ------------------
setup-infra:
	@docker-compose -f ${INFRA}/docker-compose.yml up -d


# ------------------
# Tear down
# ------------------
teardown: ## Clean up all the services, infrastructures, docker network and volumes
	@for service in ${SERVICEGROUPS}; do \
		if [ -f ${SERVICES}/$$service/docker-compose.yml ]; then \
			ROOT_DIR=${ROOT_DIR} docker-compose -f ${SERVICES}/$$service/docker-compose.yml --env-file ${ROOT_DIR}/$$service/.env down -v; \
		fi; \
	done
	ROOT_DIR=${ROOT_DIR} docker-compose -f ${INFRA}/docker-compose.yml down -v;

# ------------------
# Deployment
# ------------------
deploy:
	@set -e && \
	if [ -f ${ROOT_DIR}/$(service)/deploy.sh ]; then \
		echo "Deploying $$service service ..."; \
    cd ${ROOT_DIR}/$(service) && bash deploy.sh;\
	else \
  	echo "Service $$service not found"; \
  	exit 1;	\
	fi;

migrateAndStart:
	docker exec -it backend_app yarn && yarn build
	docker exec -it backend_app yarn typeorm migration:run -- -d dist/src/modules/database/database.config.js
	docker exec -it backend_app yarn start

migrate:
	docker exec -it backend_app yarn typeorm migration:run -- -d dist/src/modules/database/database.config.js
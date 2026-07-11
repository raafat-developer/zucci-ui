# Zucci Admin — Makefile
# Usage: make <target>   |   make help

.DEFAULT_GOAL := help
COMPOSE       := docker compose
APP_NAME      := zucci-admin
TF_DIR        := infra/terraform
ENV           ?= staging
TF_VARS       := -var-file=environments/$(ENV)/terraform.tfvars

.PHONY: help \
	install dev build build-staging build-prod preview \
	local local-build local-down \
	staging staging-build staging-down \
	prod prod-build prod-down \
	up down stop restart logs ps \
	shell shell-staging shell-prod \
	tf-init tf-plan tf-apply tf-destroy tf-output tf-fmt \
	clean clean-all

##@ Help

help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "\n\033[1mZucci Admin\033[0m — make targets\n\n"} \
		/^##@/ {printf "\n\033[1m%s\033[0m\n", substr($$0, 5)} \
		/^[a-zA-Z0-9_-]+:.*?##/ {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo

##@ Local (npm)

install: ## Install npm dependencies
	npm ci

dev: ## Run Vite dev server (→ api.zucci.xyz) http://localhost:5173
	npm run dev

build: build-prod ## Alias for build-prod

build-staging: ## Build for staging (api.zucci.xyz)
	npm run build:staging

build-prod: ## Build for production (api.zucci.com)
	npm run build:prod

preview: ## Preview the last production build
	npm run preview

##@ Docker — local (hot reload)

local: ## Start local Vite container http://localhost:5173
	$(COMPOSE) up local

local-build: ## Rebuild & start local container
	$(COMPOSE) up local --build

local-down: ## Stop local container
	$(COMPOSE) stop local
	$(COMPOSE) rm -f local

##@ Docker — staging (local preview)

staging: ## Start staging nginx http://localhost:8081
	$(COMPOSE) up staging -d --build
	@echo "Staging → http://localhost:8081  (API: https://api.zucci.xyz)"

staging-build: ## Build staging image only
	$(COMPOSE) build staging

staging-down: ## Stop staging container
	$(COMPOSE) stop staging
	$(COMPOSE) rm -f staging

##@ Docker — production (local preview)

prod: ## Start production nginx http://localhost:8080
	$(COMPOSE) up prod -d --build
	@echo "Production → http://localhost:8080  (API: https://api.zucci.com)"

prod-build: ## Build production image only
	$(COMPOSE) build prod

prod-down: ## Stop production container
	$(COMPOSE) stop prod
	$(COMPOSE) rm -f prod

##@ Docker — common

up: local ## Alias for make local

down: ## Stop and remove all compose services
	$(COMPOSE) down

stop: ## Stop all running compose services
	$(COMPOSE) stop

restart: ## Restart all compose services
	$(COMPOSE) restart

logs: ## Tail logs (SERVICE=local|staging|prod)
	$(COMPOSE) logs -f $(SERVICE)

ps: ## List compose services
	$(COMPOSE) ps

shell: ## Shell into local container
	$(COMPOSE) exec local sh

shell-staging: ## Shell into staging container
	$(COMPOSE) exec staging sh

shell-prod: ## Shell into production container
	$(COMPOSE) exec prod sh

##@ Terraform (AWS)

tf-init: ## Initialize Terraform (ENV=staging|prod)
	cd $(TF_DIR) && terraform init

tf-plan: tf-init ## Plan infrastructure (ENV=staging|prod)
	cd $(TF_DIR) && terraform plan $(TF_VARS)

tf-apply: tf-init ## Apply infrastructure (ENV=staging|prod)
	cd $(TF_DIR) && terraform apply $(TF_VARS)

tf-destroy: tf-init ## Destroy infrastructure (ENV=staging|prod) — irreversible
	cd $(TF_DIR) && terraform destroy $(TF_VARS)

tf-output: ## Show Terraform outputs (ENV=staging|prod)
	cd $(TF_DIR) && terraform output

tf-fmt: ## Format Terraform files
	cd $(TF_DIR) && terraform fmt -recursive

##@ Cleanup

clean: ## Remove build artifacts (dist/)
	rm -rf dist

clean-all: down clean ## Stop containers + remove dist, volumes, dangling images
	$(COMPOSE) down -v --remove-orphans
	-docker image prune -f --filter "label=com.docker.compose.project=$(shell basename $$(pwd) | tr '[:upper:]' '[:lower:]')"
	@echo "Cleaned."

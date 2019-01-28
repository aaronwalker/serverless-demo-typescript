
STAGE?=dev
CF_ENV=dev
REGION=ap-southeast-2

SHELL := /bin/bash

install:
	npm install

test:
	npm test

ssm:
ifneq (,$(wildcard ssm-params-${CF_ENV}.yml))
	AWS_REGION=$(REGION) awsenv create ssm-params-${CF_ENV}.yml
endif

deploy-package:
	sls deploy -v --cfenv $(CF_ENV) --stage $(STAGE) --region $(REGION)


deploy: ssm deploy-package
@Library(['ciinabox']) _
pipeline {
    environment {
      AWS_REGION = "eu-central-1"
      CIINABOX_ROLE = 'ciinabox'
    }
    agent {
      docker {
        image "base2/serverless"
        reuseNode true
      }
    }
    triggers {
      issueCommentTrigger('.*test this please.*')
    }
    stages {
      stage('Prepare') {
        steps {
          sh 'npm install'
          sh 'python3 -m pip install --user --upgrade pip'
          sh 'printenv'
          script {
            if(env.BRANCH_NAME ==~ /PR-.*/) {
              env['stage'] = "${env.CHANGE_BRANCH.replaceAll('feature/', '')}"
              if(env['stage'] == 'develop') {
                env['stage'] = 'dev'
              }
            } else if(env.BRANCH_NAME ==~ /feature\/.*/) {
              env['stage'] = "${env.BRANCH_NAME.replaceAll('feature/', '')}"
            } else  {
              env['stage'] = 'dev'
            }
            env['cfenv'] = 'dev'
          }
        }
      }
      stage('unit tests') {
        steps {
          sh 'make test'
        }
        post {
          always{
            junit allowEmptyResults: true, testResults: '**/*/results.xml'
          }
        }
      }
      stage('deploy dev/feature/pr') {
        when {
          anyOf { branch 'develop'; branch 'feature/*'; branch 'PR-*'}
        }
        steps {
          echo "deploy ${env.stage}"
          withIAMRole(env.DEV_ACCOUNT_ID, env.AWS_REGION, env.CIINABOX_ROLE) {
            sh "make deploy CF_ENV=dev STAGE=${env.stage} REGION=${env.AWS_REGION}"
          }
        }
      }
      stage('deploy staging') {
        when {
          anyOf { branch 'master'; }
        }
        steps {
          echo "deploy staging"
          withIAMRole(env.PROD_ACCOUNT_ID, env.AWS_REGION, env.CIINABOX_ROLE) {
            sh "make deploy CF_ENV=staging STAGE=staging REGION=${env.AWS_REGION}"
          }
        }
      }
      stage('Promote To Prod') {
        agent none
        when {
          anyOf { branch 'master'; }
        }
        steps {
          input message: 'Promote to Prod', ok: 'Promote'
          milestone label: 'Prod-Deploy', ordinal: 2
        }
      }
      stage('deploy prod') {
        when {
          anyOf { branch 'master'; }
        }
        steps {
          echo "deploy prod"
          withIAMRole(env.PROD_ACCOUNT_ID, env.AWS_REGION, env.CIINABOX_ROLE) {
            sh "make deploy CF_ENV=prod STAGE=prod REGION=${env.AWS_REGION}"
          }
        }
      }
    }
  }
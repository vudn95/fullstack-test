#!/bin/sh

AWS_ACCOUNT_ID=127589690210
AWS_REGION=ap-southeast-2

APP_VERSION_BUCKET=test1-versions
APP_ENV=Test2-env
APP_NAME=test2
VERSION=$(git rev-parse --short HEAD)
ECR_REPO=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/fullstack_test

echo "AppVersion: "$VERSION

function build() {
  aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
  docker build --platform linux/arm64 -f app.dockerFile -t fullstack_api:$VERSION .
  docker tag fullstack_api:$VERSION ${ECR_REPO}:$VERSION
  docker push ${ECR_REPO}:$VERSION

  echo '{
    "AWSEBDockerrunVersion": "1",
    "Image": {
      "Name": "'${AWS_ACCOUNT_ID}'.dkr.ecr.'${AWS_REGION}'.amazonaws.com/fullstack_test:'${VERSION}'",
      "Update": "true"
    },
    "Ports": [
      {
        "ContainerPort": 3000
      }
    ]
  }' >Dockerrun.aws.json

  aws s3 cp Dockerrun.aws.json s3://$APP_VERSION_BUCKET/${VERSION}:Dockerrun.aws.json
}

function createElasticBeanstalkAppVersion() {
  RESULT=$(aws elasticbeanstalk create-application-version \
    --region $AWS_REGION \
    --application-name $APP_NAME \
    --version-label $VERSION \
    --source-bundle S3Bucket=$APP_VERSION_BUCKET,S3Key=${VERSION}:Dockerrun.aws.json \
    --auto-create-application)
  echo $RESULT
}

function updateElasticBeanstalkEnv() {
  echo "UPDATING ENV $APP_ENV"
  echo "aws elasticbeanstalk update-environment --environment-name=$APP_ENV --application-name=$APP_NAME --version-labe=$VERSION"
  RESULT=$(aws elasticbeanstalk update-environment \
    --region $AWS_REGION \
    --environment-name=$APP_ENV \
    --application-name=$APP_NAME \
    --version-labe=$VERSION)
  echo $RESULT
}

function updateVersionDetail() {
  #get build date
  CURRENT_DATE=$(date -u +"%Y-%m-%d %T")

  #get lastest commit
  COMMIT=$(git log -1)
  BRANCH=$(git branch --show-current)

  echo "Build date: $CURRENT_DATE\n$COMMIT\nBranch: $BRANCH" >version.txt
}

function main() {
  updateVersionDetail
  build
  createElasticBeanstalkAppVersion
  updateElasticBeanstalkEnv
}

main

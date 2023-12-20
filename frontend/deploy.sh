#!/bin/sh
APP_BUCKET=fullstacktest-web


function buildAndUpload() {
  yarn
  yarn build
  aws s3 sync ./build s3://fullstacktest-web 
}

function main() {
  buildAndUpload
}

main

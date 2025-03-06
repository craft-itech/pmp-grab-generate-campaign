#!/bin/bash

if [ -z "$1" ]; then
    echo "Please specify tag version"
    exit 1
fi

tag="$1"
echo "$tag" > version

az acr login --name cgacraksnonprd
status=$?

if [ $status -ne 0 ]; then
    echo "Azure Container Registry login failed"
    exit 1
fi

docker build --platform=linux/amd64 -t cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:"$tag" .
status=$?

if [ $status -eq 0 ]; then
    echo "Docker build successfully"
    echo "Pushing image to Azure Container Registry"
    docker push cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:"$tag"
    status=$?

    if [ $status -eq 0 ]; then
        echo "Image pushed successfully"
    else
        echo "Image push failed"
    fi
else
    echo "Docker build failed"
fi
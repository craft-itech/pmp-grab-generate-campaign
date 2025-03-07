#!/bin/bash

if [ -z "$1" ]; then
    echo "Please specify environment"
    exit 1
fi

env="$1"
tag=$(<version)

if [ $env = "dev" ]; then
    echo "Promoting version $tag to pmpactive-dev"
    kubectl set image deploy/pmp-promotion-grabmart-producer pmp-promotion-consumer=cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:"$tag" -n pmpactive-dev
    kubectl set image deploy/pmp-promotion-grabmart-producer-2 pmp-promotion-consumer=cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:"$tag" -n pmpactive-dev
elif [ $env = "sit" ]; then
    echo "Promoting version $tag to pmpactive-sit"
    kubectl set image deploy/pmp-promotion-grabmart-producer pmp-promotion-consumer=cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:"$tag" -n pmpactive-sit
    kubectl set image deploy/pmp-promotion-grabmart-producer-2 pmp-promotion-consumer=cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:"$tag" -n pmpactive-sit
elif [ $env = "uat" ]; then
    echo "Promoting version $tag to pmpactive-uat"
    kubectl set image deploy/pmp-promotion-grabmart-producer pmp-promotion-consumer=cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:"$tag" -n pmpactive-uat
    kubectl set image deploy/pmp-promotion-grabmart-smallformat-producer pmp-promotion-grabmart-smallformat-producer=cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:"$tag" -n pmpactive-uat
    kubectl set image deploy/pmp-promotion-grabmart-producer-2 pmp-promotion-consumer=cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:"$tag" -n pmpactive-uat
    kubectl set image deploy/pmp-promotion-grabmart-smallformat-producer-2 pmp-promotion-grabmart-smallformat-producer-2=cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:"$tag" -n pmpactive-uat
else
    echo "Invalid environment"
    exit 1
fi
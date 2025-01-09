pnpm run build

docker rmi cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:v.1.1.0b0001

docker buildx build --platform linux/amd64,linux/arm64 -t cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:v.1.1.1b0001 .

az acr login --name cgacraksnonprd

docker push cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:v.1.1.1b0001

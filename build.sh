pnpm run build

docker rmi cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:v.1.0.0b0045

docker buildx build --platform linux/amd64,linux/arm64 -t cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:v.1.0.0b0063 .

az acr login --name cgacraksnonprd

docker push cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:v.1.0.0b0063

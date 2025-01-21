pnpm run build

docker rmi cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:v.1.2.0b0004

docker buildx build --platform linux/amd64,linux/arm64 -t cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:v.1.2.0b0005 .

az acr login --name cgacraksnonprd

docker push cgacraksnonprd.azurecr.io/pmp/pmp-promotion-grabmart-producer:v.1.2.0b0005

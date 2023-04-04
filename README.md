```bash
                                         
  ,           ,     /                    
   _/_   _     __   _/_    _  _   _      
_(_(__  (_(__(_/ (_ (__  _(/_(_(_/_)_(_/_
                                    .-/  
                                   (_/   
```

```yaml
on:

  repository_dispatch:

  push:
    tags:
      - 'v*'

name: build

jobs:

  test:

    runs-on: ubuntu-latest

    steps:

      - name: Checkout code
        uses: actions/checkout@master

      - uses: mateothegreat/action-kubernetes-terraform@v0.0.1
        with:
          storage_account_key: ${{ secrets.GCP_SERVICE_ACCOUNT }}
          service_account_name: ${{ secrets.GCP_SERVICE_ACCOUNT_NAME }}
          service_account_key: ${{ secrets.GCP_SERVICE_ACCOUNT }}
          kubernetes_endpoint: ${{ secrets.GKE_DEV_URL }}
          kubernetes_token: ${{ secrets.GKE_DEV_TOKEN }}
          npm_pre: "@foo:registry=https://npm.pkg.github.com/foo"
          npm_token: ${{ secrets.NPM_TOKEN }}
          npm_registry: npm.pkg.github.com
          terraform_retries: 3
          terraform_workspace: default
          docker_image_base: gcr.io/rbacai
          docker_build_args: |
            myarg1: somevalue
            supersecret: ${{ secrets.SOME_BUILD_ARG }}
          env: |
            DEBUG: true
            PORT: ${{ secrets.JWT_SECRET }}
            JWT_SECRET: ${{ secrets.JWT_SECRET }}
            DB_NAME: ${{ secrets.DB_NAME }}
            DB_PORT: ${{ secrets.DB_PORT }}
            DB_HOSTNAME: ${{ secrets.DEV_DB_HOSTNAME }}
            DB_USERNAME: ${{ secrets.DEV_DB_USERNAME }}
            DB_PASSWORD: ${{ secrets.DEV_DB_PASSWORD }}
            RABBITMQ_URI: ${{ secrets.DEV_RABBITMQ_URI }}
            RABBITMQ_EXCHANGE: ${{ secrets.RABBITMQ_EXCHANGE }}
            ELASTICSEARCH_HOST: ${{ secrets.ELASTICSEARCH_HOST }}
            ELASTICSEARCH_PORT: ${{ secrets.ELASTICSEARCH_PORT }}
            ELASTICSEARCH_SCHEME: ${{ secrets.ELASTICSEARCH_SCHEME }}

      - uses: sarisia/actions-status-discord@v1
        if: always()
        with:
          webhook: ${{ secrets.DISCORD_WEBHOOK }}

```

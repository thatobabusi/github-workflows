# Azure Essentials

The services that matter for web workloads, the az CLI survival kit, and deployment paths.

## Service Map (what to actually use)

| Need | Service | Notes |
|------|---------|-------|
| Host a web app / API (default) | **App Service** | PaaS; PHP/Node/Python/Java built in; deploy slots |
| Run containers without orchestration | **Container Apps** | Scale-to-zero, per-second billing — pairs with [Quarkus native](../backend/java/quarkus/QUARKUS_ESSENTIALS.md) |
| Full Kubernetes | AKS | Only when you truly need K8s (you often don't) |
| Functions / event glue | Azure Functions | Timers, queue triggers, webhooks |
| MySQL / Postgres | Azure Database (Flexible Server) | Managed backups, HA option |
| Redis (cache/queues) | Azure Cache for Redis | The Laravel/Django cache+queue backend |
| Files & assets | Blob Storage (+ CDN via Front Door) | S3 equivalent |
| Secrets | **Key Vault** | Never app settings for real secrets |
| Images | Container Registry (ACR) | Private registry for CI-built images |
| Logs & metrics | Application Insights + Log Analytics | Wire in before launch, not after the incident |

## az CLI Survival Kit

```bash
az login
az account list -o table
az account set --subscription "Pay-As-You-Go"

# Everything lives in a resource group — one per app per environment
az group create -n rg-myapp-prod -l southafricanorth

# Inspect anything
az resource list -g rg-myapp-prod -o table
az webapp list -o table
az webapp log tail -n myapp -g rg-myapp-prod      # live logs

# App settings (env vars)
az webapp config appsettings set -n myapp -g rg-myapp-prod \
    --settings APP_ENV=production CACHE_STORE=redis
```

`southafricanorth` (Johannesburg) is the local region — lowest latency for ZA users.

## App Service for a Laravel/PHP App

```bash
az appservice plan create -n plan-myapp -g rg-myapp-prod --sku B1 --is-linux
az webapp create -n myapp -g rg-myapp-prod --plan plan-myapp --runtime "PHP:8.4"

# Deploy: GitHub Actions (preferred) — generates the workflow for you
az webapp deployment github-actions add \
    -n myapp -g rg-myapp-prod --repo thatobabusi/myapp --branch main
```

Production checklist:

- [ ] **Deploy slots**: deploy to `staging` slot → health check → `az webapp deployment slot swap` = zero-downtime with instant rollback ([Deployment Guide](../../DEPLOYMENT_GUIDE.md) symlink strategy, managed)
- [ ] App settings from Key Vault references, not pasted values: `@Microsoft.KeyVault(SecretUri=...)`
- [ ] `WEBSITES_ENABLE_APP_SERVICE_STORAGE=false` for containerized apps
- [ ] Always On enabled (B1+) so the app doesn't cold-start after idle
- [ ] Custom domain + managed certificate (free) + HTTPS-only flag

## Container Apps for Images

```bash
az acr create -n acrbabusi -g rg-myapp-prod --sku Basic
az acr build -r acrbabusi -t myapp:{{.Run.ID}} .     # build in the cloud

az containerapp create -n myapp -g rg-myapp-prod \
    --image acrbabusi.azurecr.io/myapp:latest \
    --target-port 8080 --ingress external \
    --min-replicas 0 --max-replicas 5                # scale to zero
```

Scale-to-zero + per-second billing makes this the cheapest way to run small [Docker](../docker/DOCKER_CHEAT_SHEET.md) workloads that sleep at night.

## CI/CD Integration

OIDC federation — no publish-profile secrets stored in GitHub ([Actions Advanced](../../ACTIONS_ADVANCED.md) security rules):

```yaml
permissions:
  id-token: write
  contents: read

steps:
  - uses: azure/login@v2
    with:
      client-id: ${{ vars.AZURE_CLIENT_ID }}
      tenant-id: ${{ vars.AZURE_TENANT_ID }}
      subscription-id: ${{ vars.AZURE_SUBSCRIPTION_ID }}

  - uses: azure/webapps-deploy@v3
    with:
      app-name: myapp
      slot-name: staging
```

The deploy job still sits behind the [lint + test gates](../../LINTING_GATES.md); the slot swap happens only after the staging health check passes.

## Cost Sanity

- **Budgets + alerts on day one:** `az consumption budget create` — surprise bills are self-inflicted
- Dev/test environments: B-series burstable VMs/plans, auto-shutdown, scale-to-zero Container Apps
- Delete by resource group: `az group delete -n rg-experiment` removes every stray resource inside
- One resource group per app per environment makes cost attribution trivial (`rg-myapp-prod`, `rg-myapp-staging`)

## Naming Convention

```
rg-{app}-{env}          rg-myapp-prod
plan-{app}              plan-myapp
{app}-{env}             myapp-staging (web app / container app)
acr{org}                acrbabusi (alphanumeric only)
kv-{app}-{env}          kv-myapp-prod
```

## See Also

- [Docker Cheat Sheet](../docker/DOCKER_CHEAT_SHEET.md)
- [Deployment Guide](../../DEPLOYMENT_GUIDE.md)
- [Actions Advanced](../../ACTIONS_ADVANCED.md) — OIDC details

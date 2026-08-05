# Kubernetes deployment environment

These manifests are applied by the `deploy` job in
`.github/workflows/ci-cd.yml`, which runs on the self-hosted GitHub Actions
runner and deploys into a local **minikube** cluster on that same machine.
This document covers the one-time setup needed on that machine before the
pipeline can deploy successfully.

## Prerequisites on the runner machine

- Docker installed and running (minikube's default driver).
- [minikube](https://minikube.sigs.k8s.io/docs/start/) installed.
- `kubectl` installed and on `PATH` for the runner service account.
- Outbound network access to `ghcr.io` (minikube pulls the app image from
  there on every deploy).

## One-time setup

1. Start minikube under the same user account the GitHub Actions runner
   service runs as (kubeconfig and context are per-user):

   ```bash
   minikube start
   ```

   This creates a `kubectl` context named `minikube` and points
   `~/.kube/config` at it — the pipeline runs `kubectl config use-context
   minikube` before every deploy, so the context name must match.

2. Confirm the runner can reach the cluster:

   ```bash
   kubectl config use-context minikube
   kubectl cluster-info
   ```

3. Make sure minikube starts automatically (or is already running) whenever
   the runner picks up a job — the pipeline does not start minikube itself,
   it only deploys into whatever cluster the `minikube` context points to.

The `ghcr-credentials` image-pull secret and the `travel-planner-env` secret
are created/updated automatically by the pipeline on every run
(`kubectl create secret ... --dry-run=client -o yaml | kubectl apply -f -`),
so no manual secret creation is required in the cluster itself.

## Required GitHub repository secrets

Set these under **Settings → Secrets and variables → Actions**. The pipeline
uses `GITHUB_TOKEN` automatically for the GHCR pull secret; the rest are
consumed as runtime env vars in the `travel-planner-env` Kubernetes secret
(and the `NEXT_PUBLIC_*` ones are also baked into the client bundle at build
time via Docker build-args):

| Secret | Used for |
| --- | --- |
| `API_BASE_URL` | Server-side API base URL at runtime |
| `NEXT_PUBLIC_API_BASE_URL` | Build-time client bundle + runtime |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Build-time client bundle + runtime |
| `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` | Build-time client bundle + runtime |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Runtime only |

## Accessing the deployed app

The `frontend` Service is `NodePort` on `30080`. From the runner machine:

```bash
minikube ip        # cluster node IP
curl http://$(minikube ip):30080
```

The pipeline prints this URL at the end of every successful deploy.

## Manual verification / troubleshooting

```bash
kubectl get deployment travel-planner
kubectl get pods -l app=travel-planner
kubectl logs -l app=travel-planner --tail=100
kubectl describe pod -l app=travel-planner   # check ImagePullBackOff etc.
kubectl get secret ghcr-credentials travel-planner-env
```

If pods show `ImagePullBackOff`, check that `ghcr-credentials` was created
with a token that has `read:packages` scope and that the GHCR package
visibility/permissions allow the token's identity to pull it.

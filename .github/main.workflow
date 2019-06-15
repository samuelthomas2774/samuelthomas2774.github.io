workflow "New workflow" {
  on = "deployment"
  resolves = ["Clear Cloudflare cache"]
}

action "Clear Cloudflare cache" {
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  secrets = [
    "CLOUDFLARE_EMAIL",
    "CLOUDFLARE_TOKEN",
    "CLOUDFLARE_ZONE",
  ]
  args = [
    "POST",
    "X-Auth-Email: $CLOUDFLARE_EMAIL",
    "X-Auth-Key: $CLOUDFLARE_TOKEN",
    "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE/purge_cache",
    "purge_everything:=true",
  ]
}

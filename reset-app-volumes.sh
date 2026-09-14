#!/usr/bin/env bash
set -euo pipefail

# Zatrzymuje kontenery compose i usuwa wolumeny node_modules dla
# vendure oraz shop-frontend, NIE ruszając wolumenu bazy danych (vendure_db_data).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

VOLUMES_TO_REMOVE=(
  "vendure_repo_node_modules"
  "vendure_app_node_modules"
  "shop_frontend_repo_node_modules"
  "shop_frontend_app_node_modules"
)

echo "Zatrzymuję kontenery (docker compose down)..."
docker compose down

for base_name in "${VOLUMES_TO_REMOVE[@]}"; do
  # Nazwa wolumenu w Dockerze jest poprzedzona nazwą projektu compose
  # (np. "vendure-shop_vendure_repo_node_modules"), więc dopasowujemy po sufiksie.
  matches="$(docker volume ls --format '{{.Name}}' | grep -E "(^|_)${base_name}\$" || true)"

  if [ -z "$matches" ]; then
    echo "Wolumen pasujący do '${base_name}' nie znaleziony, pomijam."
    continue
  fi

  while IFS= read -r vol; do
    echo "Usuwam wolumen: ${vol}"
    docker volume rm "$vol"
  done <<< "$matches"
done

echo "Gotowe."

stop.sh

ollama run mistral &

supabase start
docker compose pull && docker compose up
#docker compose -f docker-compose.dev.yml up --build

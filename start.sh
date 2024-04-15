#launchctl setenv OLLAMA_HOST=0.0.0.0:11434 && ollama run llama2

supabase start
#docker compose pull && docker compose up
docker compose -f docker-compose.dev.yml up --build

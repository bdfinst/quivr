alter table "public"."vectors" alter column "embedding" set not null;

alter table "public"."vectors" alter column "embedding" set data type vector using "embedding"::vector;
alter table "public"."user_settings" alter column "models" set default '["ollama/llama2","ollama/mistral"]'::jsonb;



# Quivr - Your Second Brain, Empowered by Generative AI

<div align="center">
    <img src="./logo.png" alt="Quivr-logo" width="30%"  style="border-radius: 50%; padding-bottom: 20px"/>
</div>

[![Discord Follow](https://dcbadge.vercel.app/api/server/HUpRgp2HG8?style=flat)](https://discord.gg/HUpRgp2HG8)
[![GitHub Repo stars](https://img.shields.io/github/stars/quivrhq/quivr?style=social)](https://github.com/quivrhq/quivr)
[![Twitter Follow](https://img.shields.io/twitter/follow/StanGirard?style=social)](https://twitter.com/_StanGirard)

Quivr, your second brain, utilizes the power of GenerativeAI to be your personal assistant ! Think of it as Obsidian, but turbocharged with AI capabilities.

[Roadmap here](https://docs.quivr.app/docs/roadmap)

## Key Features 🎯

- **Fast and Efficient**: Designed with speed and efficiency at its core. Quivr ensures rapid access to your data.
- **Secure**: Your data, your control. Always.
- **OS Compatible**: Ubuntu 22 or newer.
- **File Compatibility**: Text, Markdown, PDF, Powerpoint, Excel, CSV, Word, Audio, Video
- **Open Source**: Freedom is beautiful, and so is Quivr. Open source and free to use.
- **Public/Private**: Share your brains with your users via a public link, or keep them private.
- **Marketplace**: Share your brains with the world, or use other people's brains to boost your productivity.
- **Offline Mode**: Quivr works offline, so you can access your data anytime, anywhere.

## Demo Highlights 🎥

https://github.com/quivrhq/quivr/assets/19614572/a6463b73-76c7-4bc0-978d-70562dca71f5

## Getting Started 🚀

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

You can find everything on the [documentation](https://docs.quivr.app/).

### Prerequisites 📋

Ensure you have the following installed:

- Docker
- Docker Compose

### 60 seconds Installation 💽

You can find the installation video [here](https://www.youtube.com/watch?v=cXBa6dZJN48).

- **Step 0**: Supabase CLI

  Follow the instructions [here](https://supabase.com/docs/guides/cli/getting-started) to install the Supabase CLI that is required.

  ```bash
  supabase -v # Check that the installation worked
  ```

- **Step 1**: Clone the repository:

  ```bash
  git clone https://github.com/quivrhq/quivr.git && cd quivr
  ```

- **Step 2**: Copy the `.env.example` files

  ```bash
  cp .env.example .env
  ```

- **Step 3**: Update the `.env` files

  ```bash
  vim .env # or emacs or vscode or nano
  ```

#### Using OpenAI

  Update **OPENAI_API_KEY** in the `.env` file.

  You just need to update the `OPENAI_API_KEY` variable in the `.env` file. You can get your API key [here](https://platform.openai.com/api-keys). You need to create an account first. And put your credit card information. Don't worry, you won't be charged unless you use the API. You can find more information about the pricing [here](https://openai.com/pricing/).

  Start the database.

  ```bash
  supabase start
  ```

#### Using Ollama

- Install [Ollama](https://ollama.com/)
- Modify the Quivr DB to use the Ollama Model
  - Start the database:
  
  ```bash
  $ supabase start
  Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
  ```

  - create a new DB migration script:

  ```bash
  $ supabase migration new ollama
  Created new migration at supabase/migrations/<TIME_STAMP>_ollama.sql
  ```

  - Copy the Ollama migration to the new migration script

  ```bash
  cp supabase/migrations/local_20240107152745_ollama.sql <new script name>
  ```

  - Modify the new migration script to alter the `user_settings` table to use Ollama instead of ChatGPT:

  ```sql
  alter table "public"."user_settings" alter column "models" set default '["ollama/llama2","ollama/mistral"]'::jsonb;
  ```

  - Add SQL to the end of `supabase/seed.sql` to update the default user's models
  
  ```sql
  UPDATE
    "public"."user_settings"
  SET
    "models" = '["ollama/llama2","ollama/mistral"]',
    "is_premium" = TRUE,
    "api_access" = TRUE,
    "monthly_chat_credit" = 50000
  WHERE
    "user_id" = '39418e3b-0258-4452-af60-7acfcc1263ff';
  ```

  - Run the table migration command

  ```bash
  supabase db reset
  ```

- **Step 4**: Launch the project

  and then

  ```bash
  docker compose pull
  docker compose up
  ```

  or, for Dev mode

  ```bash
  docker compose -f docker-compose.dev.yml up --build
  ```

  If you have a Mac, go to Docker Desktop > Settings > General and check that the "file sharing implementation" is set to `VirtioFS`.

  If you are a developer, you can run the project in development mode with: `docker compose -f docker-compose.dev.yml up --build`

- **Step 5**: Login to the app

  You can now sign in to the app with `admin@quivr.app` & `admin`. You can access the app at [http://localhost:3000/login](http://localhost:3000/login).

  You can access Quivr backend API at [http://localhost:5050/docs](http://localhost:5050/docs)

  You can access `supabase` at [http://localhost:54323](http://localhost:54323)

## Creating new users

Connect to the database at [http://localhost:54323/project/default/auth/users](http://localhost:54323/project/default/auth/users) with `admin/admin` credentials to create
new users. Auto-confirm the email.

## Updating Quivr 🚀

- **Step 1**: Pull the latest changes

  ```bash
  git pull
  ```

- **Step 2**: Update the migration

  ```bash
  supabase migration up
  ```

## Contributors ✨

Thanks go to these wonderful people:
<a href="https://github.com/quivrhq/quivr/graphs/contributors">
<img src="https://contrib.rocks/image?repo=quivrhq/quivr" />
</a>

## Contribute 🤝

Did you get a pull request? Open it, and we'll review it as soon as possible. Check out our project board [here](https://github.com/users/StanGirard/projects/5) to see what we're currently focused on, and feel free to bring your fresh ideas to the table!

- [Open Issues](https://github.com/quivrhq/quivr/issues)
- [Open Pull Requests](https://github.com/quivrhq/quivr/pulls)
- [Good First Issues](https://github.com/quivrhq/quivr/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)
- [Frontend Issues](https://github.com/quivrhq/quivr/issues?q=is%3Aopen+is%3Aissue+label%3Afrontend)
- [Backend Issues](https://github.com/quivrhq/quivr/issues?q=is%3Aopen+is%3Aissue+label%3Abackend)
- [Translate](https://docs.quivr.app/docs/Developers/contribution/guidelines#translations)

## Partners ❤️

This project would not be possible without the support of our partners. Thank you for your support!

<a href="https://ycombinator.com/">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Y_Combinator_logo.svg/1200px-Y_Combinator_logo.svg.png" alt="YCombinator" style="padding: 10px" width="70px">
</a>
<a href="https://www.theodo.fr/">
  <img src="https://avatars.githubusercontent.com/u/332041?s=200&v=4" alt="Theodo" style="padding: 10px" width="70px">
</a>

## License 📄

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details

## Stars History 📈

[![Star History Chart](https://api.star-history.com/svg?repos=quivrhq/quivr&type=Timeline)](https://star-history.com/#quivrhq/quivr&Timeline)

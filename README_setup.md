# MyBavul Setup Guide (Vite Standard)

This guide provides all the necessary steps to get your MyBavul application running using a standard Vite environment.

## 1. Local Development Setup: `.env.local` File

For local development, Vite uses a `.env.local` file in the root of your project to manage environment variables. This file should **never** be committed to version control.

**Steps:**

1.  In the root directory of your project, create a new file named `.env.local`.
2.  Copy the contents of the `.env.example` file (or the block below) into your new `.env.local` file.
3.  Replace the placeholder values with your actual secret keys.

### `.env.local` Template

```env
# Supabase Configuration
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"

# Google Gemini AI Configuration
VITE_API_KEY="your-google-ai-studio-api-key"
```

## 2. Environment Variables (Secrets)

Your application requires several secret keys to connect to external services.

### Client-Side Variables (for Vite)

These variables are exposed to your frontend application. **Vite requires that these variables be prefixed with `VITE_` to be accessible in your code.**

| Variable Name                | Description                                                                    | How to get it                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`          | The unique URL for your Supabase project.                                      | In your Supabase project: **Settings > API > Project URL**.                        |
| `VITE_SUPABASE_ANON_KEY`     | The public, "anonymous" key for your Supabase project, safe to use in a browser. | In your Supabase project: **Settings > API > Project API Keys > `anon` `public`**. |
| `VITE_STRIPE_PUBLISHABLE_KEY`| The public key for Stripe, used on the frontend to initialize Stripe.js.       | In your Stripe Dashboard: **Developers > API Keys > Publishable key** (e.g., `pk_test_...`). |
| `VITE_API_KEY`               | Your Google Gemini API Key for the AI Assistant feature.                       | Get this from [Google AI Studio](https://aistudio.google.com/).                    |

### Server-Side Variables (for Supabase Edge Functions)

These are configured directly in your Supabase project secrets. You can set them via the Supabase CLI or in the Dashboard under **Project Settings > Functions > Secrets**. **These do NOT use the `VITE_` prefix.**

| Variable Name                | Description                                                                    | How to get it                                                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `SUPABASE_SERVICE_ROLE_KEY`  | The secret "service role" key for server-side operations with full access.     | In your Supabase project: **Settings > API > Project API Keys > `service_role` `secret`**. |
| `STRIPE_SECRET_KEY`          | The secret key for Stripe, used on the server-side to make API calls.          | In your Stripe Dashboard: **Developers > API Keys > Secret key** (e.g., `sk_test_...`). |
| `STRIPE_WEBHOOK_SECRET`      | A secret used to verify that webhook events are actually from Stripe.          | In your Stripe Dashboard: **Developers > Webhooks > [Your Endpoint] > Signing secret** (e.g., `whsec_...`). See step 4.            |
| `SITE_URL`                   | The public URL of your frontend application (e.g., `https://mybavul.com`). **This is critical for Stripe payment redirects.** | Your application's deployment URL.                                                      |
| `HOTELBEDS_API_KEY`          | The API key for the Hotelbeds API to search for hotels.                        | Provided by Hotelbeds.                                                                                                                   |
| `HOTELBEDS_SECRET`           | The secret key for the Hotelbeds API, used to generate a request signature.      | Provided by Hotelbeds.                                                                                                                   |


## 3. Database Schema Setup

The entire database structure, including tables, relationships, security policies (RLS), and initial data, is defined in a single SQL file.

**This step is critical.**

**Steps:**

1.  Navigate to your Supabase project dashboard.
2.  In the left sidebar, go to the **SQL Editor**.
3.  Click on **+ New query**.
4.  Open the file `supabase/schema.sql` from this project.
5.  Copy the entire content of the file.
6.  Paste it into the Supabase SQL Editor.
7.  Click **RUN**.

This will create all necessary tables and enable Row Level Security.

## 4. Deploy Supabase Edge Functions

The payment, cancellation, and hotel search logic runs on Supabase Edge Functions. You need to deploy them using the Supabase CLI.

**Prerequisites:**
*   [Install the Supabase CLI](https://supabase.com/docs/guides/cli).
*   Log in to the CLI: `supabase login`.
*   Link your project: `supabase link --project-ref <your-project-id>`.
*   Set your server-side secrets: `supabase secrets set --env-file ./supabase/functions/.env.local`.

**Deployment:**

```bash
supabase functions deploy
```

## 5. Configure Stripe Webhook

You must tell Stripe where to send events (like a successful payment).

1.  Go to your Stripe Dashboard > **Developers > Webhooks**.
2.  Click **+ Add an endpoint**.
3.  **Endpoint URL:** Use the URL for the `stripe-webhook-handler` function from the previous step: `https://<your-project-ref>.supabase.co/functions/v1/stripe-webhook-handler`.
4.  **Listen to events:** Select:
    *   `checkout.session.completed`
    *   `charge.refunded`
    *   `charge.dispute.created`
5.  Click **Add endpoint**.
6.  Find the **Signing secret** (`whsec_...`) and set it as a Supabase secret named `STRIPE_WEBHOOK_SECRET`.


## 6. Configure Google OAuth

Prevent the **`redirect_uri_mismatch`** error by authorizing your application's URLs.

1.  Go to **Google Cloud Console > APIs & Services > Credentials**.
2.  Edit your **OAuth 2.0 Client ID**.
3.  Under **Authorized redirect URIs**, add the following:
    *   `https://<your-project-ref>.supabase.co/auth/v1/callback`
    *   `http://localhost:5173` (or your local dev port)
    *   `https://your-production-site.com`
4.  Click **Save**.

Your MyBavul application is now fully configured and ready to run.
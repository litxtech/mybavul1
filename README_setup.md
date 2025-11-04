# MyBavul Setup Guide (Vite Standard)

This guide provides all the necessary steps to get your MyBavul application running using a standard Vite environment.

## 1. Environment Variables (Secrets)

Your application has two distinct parts that need configuration: the **Frontend** (your Vite app, deployed to a host like Vercel) and the **Backend** (your Supabase Edge Functions). They use separate environment variables.

### 1.1. Frontend Variables (for Vite / Vercel)

These variables are for your user-facing application.

-   **For Production (Vercel):** Set these in your Vercel project's settings.
-   **For Local Development:** Use the `.env.local` file in the project root.
-   **Rule:** They **MUST** be prefixed with `VITE_`.

**`.env.local` Template (Project Root):**

```env
# Supabase Configuration
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"

# Google Gemini AI Configuration
VITE_API_KEY="your-google-ai-studio-api-key"
```

| Variable Name                | Description                                                                    | How to get it                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`          | The unique URL for your Supabase project.                                      | In your Supabase project: **Settings > API > Project URL**.                        |
| `VITE_SUPABASE_ANON_KEY`     | The public, "anonymous" key for your Supabase project, safe to use in a browser. | In your Supabase project: **Settings > API > Project API Keys > `anon` `public`**. |
| `VITE_STRIPE_PUBLISHABLE_KEY`| The public key for Stripe, used on the frontend to initialize Stripe.js.       | In your Stripe Dashboard: **Developers > API Keys > Publishable key** (e.g., `pk_test_...`). |
| `VITE_API_KEY`               | Your Google Gemini API Key for the AI Assistant feature.                       | Get this from [Google AI Studio](https://aistudio.google.com/).                    |

---

### 1.2. Backend Variables (for Supabase Functions)

These variables are for your secure, server-side functions (`search-hotels`, `create-checkout-session`, etc.).

-   **For Production (Supabase):** Set these in your **Supabase Dashboard** under **Project Settings > Functions > Secrets**.
-   **For Local Development:** Use the `supabase/functions/.env.local` file.
-   **Rule:** They **DO NOT** use the `VITE_` prefix.

**`supabase/functions/.env.local` Template:**
```env
# This file is for LOCAL testing with `supabase functions serve`
SITE_URL="http://localhost:5173"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
SUPABASE_SERVICE_ROLE_KEY="..."
HOTELBEDS_API_KEY="..."
HOTELBEDS_SECRET="..."
```

| Variable Name                | Description                                                                    | Where to Set (Production)                                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `SUPABASE_SERVICE_ROLE_KEY`  | The secret "service role" key for server-side operations with full access.     | **Supabase Secrets**. Get from: **Settings > API > Project API Keys > `service_role` `secret`**. |
| `STRIPE_SECRET_KEY`          | The secret key for Stripe, used on the server-side to make API calls.          | **Supabase Secrets**. Get from: **Stripe Dashboard > Developers > API Keys > Secret key** (`sk_test_...`). |
| `STRIPE_WEBHOOK_SECRET`      | A secret used to verify that webhook events are actually from Stripe.          | **Supabase Secrets**. Get from: **Stripe Dashboard > Developers > Webhooks > [Your Endpoint] > Signing secret** (`whsec_...`). See step 5. |
| `SITE_URL`                   | The public URL of your **frontend application** (e.g., `https://mybavul.com`). **This is critical for Stripe payment redirects.** | **Supabase Secrets**. Your application's deployment URL from Vercel.                                                      |
| `HOTELBEDS_API_KEY`          | The API key for the Hotelbeds API to search for hotels.                        | **Supabase Secrets**. Provided by Hotelbeds upon partnership approval.                                                                    |
| `HOTELBEDS_SECRET`           | The secret key for the Hotelbeds API, used to generate a request signature.      | **Supabase Secrets**. Provided by Hotelbeds upon partnership approval.                                                                    |

## 2. Supabase Project Configuration (Dashboard UI)

In addition to secrets, some settings must be configured in the Supabase dashboard UI. Getting these wrong can cause authentication and payment redirect issues.

### 2.1. Authentication URL Configuration

This is the **most common source of OAuth errors**, such as `404: NOT_FOUND` with code `DEPLOYMENT_NOT_FOUND`. It tells Supabase where to send users after they successfully log in with a third party like Google.

1.  Go to your Supabase Dashboard.
2.  In the left sidebar, navigate to **Authentication > URL Configuration**.
3.  **Site URL:** Set this to the main URL of your deployed frontend application.
    *   **For Local Development:** `http://localhost:5173` (or your dev port).
    *   **For Production:** `https://your-production-site.com`.
4.  **Additional Redirect URLs:** This is crucial for development and preview deployments. Add any other URLs you need. Use wildcards (`*`) if your provider supports them (Vercel does).
    *   `http://localhost:5173/**`
    *   `https://your-project-*.vercel.app/**` (Example for Vercel previews)
5.  Click **Save**.

> **CRITICAL:** The error you are seeing (`DEPLOYMENT_NOT_FOUND`) usually means the **Site URL** is pointing to an old, deleted preview deployment. Make sure it points to your main, active site URL.

## 3. Database Schema Setup

The entire database structure, including tables, relationships, security policies (RLS), and initial data, is defined in a single SQL file. **This step is critical.**

**Steps:**
1.  Navigate to your Supabase project dashboard.
2.  In the left sidebar, go to the **SQL Editor**.
3.  Click on **+ New query**.
4.  Open the file `supabase/schema.sql` from this project.
5.  Copy the entire content of the file and paste it into the Supabase SQL Editor.
6.  Click **RUN**.

This will create all necessary tables and enable Row Level Security.

## 4. Deploy Supabase Edge Functions

The payment, search, availability check, and cancellation logic runs on Supabase Edge Functions. You need to deploy them using the Supabase CLI. Your app includes: `search-hotels`, `create-checkout-session`, `stripe-webhook-handler`, `cancel-booking`, and `check-availability`.

**Prerequisites:**
*   [Install the Supabase CLI](https://supabase.com/docs/guides/cli).
*   Log in to the CLI: `supabase login`.
*   Link your project: `supabase link --project-ref <your-project-id>`.
*   Set your server-side secrets for local development: create `supabase/functions/.env.local` as described in section 1.2.

**Deployment:**

```bash
# This command deploys all functions in your supabase/functions directory
supabase functions deploy
```
This command deploys your functions. They will use the secrets you configured in the Supabase Dashboard.

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
6.  Find the **Signing secret** (`whsec_...`) and set it as a Supabase secret named `STRIPE_WEBHOOK_SECRET` (see section 1.2).


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
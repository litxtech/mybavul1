# MyBavul Setup Guide

This guide provides all the necessary steps to get your MyBavul application running, from setting up the database to deploying the serverless functions required for payments.

## 1. Environment Variables (Secrets)

Your application requires several secret keys to connect to external services. These should be stored as environment variables, not hardcoded in the source.

### Client-Side Variables (for Vite)

In your development environment, create a `.env` file in the root directory. In production (e.g., Vercel), these should be set in the project's "Environment Variables" settings. **These variables must be prefixed with `VITE_`.**

| Variable Name                | Description                                                                    | How to get it                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`          | The unique URL for your Supabase project.                                      | In your Supabase project: **Settings > API > Project URL**.                        |
| `VITE_SUPABASE_ANON_KEY`     | The public, "anonymous" key for your Supabase project, safe to use in a browser. | In your Supabase project: **Settings > API > Project API Keys > `anon` `public`**. |
| `VITE_STRIPE_PUBLISHABLE_KEY`| The public key for Stripe, used on the frontend to initialize Stripe.js.       | In your Stripe Dashboard: **Developers > API Keys > Publishable key** (e.g., `pk_test_...`). |
| `VITE_API_KEY`               | Your Google Gemini API Key for the AI Assistant feature.                       | Get this from [Google AI Studio](https://aistudio.google.com/).                    |

### Server-Side Variables (for Supabase Edge Functions)

These are configured directly in your Supabase project secrets. You can set them via the Supabase CLI or in the Dashboard under **Settings > Functions**. **NEVER expose these publicly.**

| Variable Name                | Description                                                                    | How to get it                                                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `SUPABASE_SERVICE_ROLE_KEY`  | The secret "service role" key for server-side operations with full access.     | In your Supabase project: **Settings > API > Project API Keys > `service_role` `secret`**. |
| `STRIPE_SECRET_KEY`          | The secret key for Stripe, used on the server-side to make API calls.          | In your Stripe Dashboard: **Developers > API Keys > Secret key** (e.g., `sk_test_...`). |
| `STRIPE_WEBHOOK_SECRET`      | A secret used to verify that webhook events are actually from Stripe.          | In your Stripe Dashboard: **Developers > Webhooks > [Your Endpoint] > Signing secret** (e.g., `whsec_...`). See step 4.            |
| `SITE_URL`                   | The public URL of your frontend application (e.g., `https://mybavul.com`). **This must be the URL where users access your site, NOT your Supabase URL.** It is critical for Stripe payment redirects. | Your application's deployment URL.                                                      |


## 2. Database Schema Setup

The entire database structure, including tables, relationships, security policies (RLS), and initial data, is defined in a single SQL file.

**This step is critical.** The SQL script not only creates the database tables but also **seeds the database with sample hotel data**. Without this data, the search functionality will not return any results.

**Steps:**

1.  Navigate to your Supabase project dashboard.
2.  In the left sidebar, go to the **SQL Editor**.
3.  Click on **+ New query**.
4.  Open the file `supabase/schema.sql` from this project.
5.  Copy the entire content of the file.
6.  Paste it into the Supabase SQL Editor.
7.  Click **RUN**.

This will create all the necessary tables (`tenants`, `properties`, `bookings`, `wallet_ledger`, etc.), populate them with sample hotels in locations like Istanbul and Antalya, and enable Row Level Security to protect your data.

## 3. Deploy Supabase Edge Functions

The payment and booking logic runs on Supabase Edge Functions for security. You need to deploy these functions using the Supabase CLI.

**Prerequisites:**
*   [Install the Supabase CLI](https://supabase.com/docs/guides/cli).
*   Log in to the CLI with `supabase login`.
*   Link your local project to your Supabase project with `supabase link --project-ref <your-project-id>`.
*   Set your server-side secrets: `supabase secrets set --env-file ./supabase/functions/.env.local` (create this file for your secrets).

**Deployment Steps:**

1.  Open your terminal in the root of the project directory.
2.  Run the following command to deploy all functions. This command will deploy `create-checkout-session`, `stripe-webhook-handler`, and the new `cancel-booking` function.

    ```bash
    supabase functions deploy
    ```

3.  After deployment, you will get URLs for each function. You will need the URL for `stripe-webhook-handler` for the next step.

## 4. Configure Stripe Webhook

You must tell Stripe where to send events (like a successful payment, refund, or dispute).

**Steps:**

1.  Go to your Stripe Dashboard.
2.  Navigate to **Developers > Webhooks**.
3.  Click **+ Add an endpoint**.
4.  **Endpoint URL:** Paste the URL for the `stripe-webhook-handler` function you got in the previous step. It will look like this: `https://<your-project-ref>.supabase.co/functions/v1/stripe-webhook-handler`. 
    **Important:** Replace `<your-project-ref>` with your actual Supabase project reference ID (e.g., `jtxaonuslkwduusqfaep`).
5.  **Listen to events:** Click "Select events" and choose:
    *   `checkout.session.completed`
    *   `charge.refunded`
    *   `charge.dispute.created`
6.  Click **Add endpoint**.
7.  On the next page, find the **Signing secret** (it looks like `whsec_...`).
8.  Copy this secret and set it as a Supabase secret named `STRIPE_WEBHOOK_SECRET`.

Your MyBavul application is now fully configured and ready to handle live bookings, payments, cancellations, and disputes!
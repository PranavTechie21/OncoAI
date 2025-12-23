# AI Chatbot Setup Guide

## Quick Setup

### Step 1: Create `.env` file

Create a `.env` file in the root directory with the following content:

```env
# Choose your AI provider: 'openai' or 'gemini'
VITE_AI_PROVIDER=openai

# For OpenAI (Recommended - you have $399 subscription)
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here

# OR for Gemini (Alternative)
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

### Step 2: Get Your API Keys

#### Option A: OpenAI (Recommended)
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Paste it in `.env` as `VITE_OPENAI_API_KEY`

#### Option B: Google Gemini
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Paste it in `.env` as `VITE_GEMINI_API_KEY`
6. Set `VITE_AI_PROVIDER=gemini`

### Step 3: Restart Development Server

After adding your API keys, restart the dev server:

```bash
npm run dev
```

## Features

✅ **Dynamic AI Responses** - Real-time AI-powered conversations
✅ **Context-Aware** - Remembers conversation history
✅ **Dual Provider Support** - Switch between OpenAI and Gemini
✅ **Fallback Mode** - Works even without API keys (uses intelligent fallbacks)
✅ **Error Handling** - Graceful error messages and retry functionality
✅ **Specialized for Oncology** - Trained on medical/oncology context

## Testing

1. Open the chatbot (bottom-right corner)
2. Try asking:
   - "What treatment options are available for lung cancer?"
   - "How do I assess patient risk scores?"
   - "Explain immunotherapy for breast cancer"
   - "What biomarkers should I check?"

## Troubleshooting

### "API key not configured" error
- Make sure your `.env` file is in the root directory
- Check that the variable names start with `VITE_`
- Restart the dev server after adding keys

### API errors
- Verify your API key is correct
- Check your API quota/credits
- For OpenAI: Ensure you have credits in your account
- For Gemini: Check API usage limits

### Fallback mode
If API keys aren't set, the chatbot will use intelligent fallback responses based on keywords in your questions.

## Security Note

⚠️ **Important**: Never commit your `.env` file to git. It's already in `.gitignore`.

For production, set environment variables in your hosting platform's settings.


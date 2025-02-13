# Coffee Shop

## Setup

// ...existing content...

### OpenAI Integration

To enable the OpenAI integration for the chatbot on the support page, follow these steps:

1. Obtain your OpenAI API key from [OpenAI](https://beta.openai.com/signup/).
2. Replace `YOUR_OPENAI_API_KEY` in `support.js` with your actual OpenAI API key.

```javascript
// filepath: /Users/brianlichtenstein/Desktop/coffee-shop/public/support.js
// ...existing code...
'Authorization': `Bearer YOUR_OPENAI_API_KEY`
// ...existing code...
```

3. Save the changes and restart your server if necessary.

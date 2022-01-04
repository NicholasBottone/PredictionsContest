# Backend

The backend web server is powered by Express.js.

## Environment Variables

These must be included in the `.env` file in the root of the backend project.

```
DISCORD_CLIENT_ID = "your-discord-client-id"
DISCORD_SECRET_TOKEN = "your-discord-client-secret"
DISCORD_CALLBACK_URL = "http://localhost:5000/auth/callback"
CLIENT_URL = "http://localhost:3000"
SESSION_SECRET = "your-session-secret"
MONGODB_URI = "your-mongodb-uri"
PORT = 5000
```

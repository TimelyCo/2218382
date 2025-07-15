# Backend Test Submission

This backend application provides:
- URL Shortening API
- URL Redirection
- URL Analytics
- Integrated Logging via the provided middleware

## APIs

### 1. Create Short URL
- **POST** `/shorturls`
- Body: 
```json
{
  "url": "https://example.com",
  "validity": 10,
  "shortcode": "custom1"
}
```

2. Redirect
GET /:shortcode

3. Stats
GET /shorturls/:shortcode

Setup
```bash
npm install
node server.js
```
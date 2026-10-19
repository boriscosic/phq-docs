# OAuth 2.0 Integration Code Examples

This guide provides tested code examples for integrating with PrairieHQ's OAuth 2.0 and OpenID Connect provider.

---

## 1. Public Client (Browser SPA / Mobile)

Public clients cannot securely store a `client_secret` and must authenticate with **PKCE only**.

### PKCE Helper Functions (Browser Web Crypto API)

```typescript
function base64UrlEncode(arrayBuffer: ArrayBuffer): string {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function generatePkce() {
  const randomBytes = new Uint8Array(32);
  window.crypto.getRandomValues(randomBytes);
  const codeVerifier = base64UrlEncode(randomBytes);

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const codeChallenge = base64UrlEncode(digest);

  const stateBytes = new Uint8Array(16);
  window.crypto.getRandomValues(stateBytes);
  const state = base64UrlEncode(stateBytes);

  return { codeVerifier, codeChallenge, state };
}
```

### Initiating Login Redirect

```typescript
export async function loginWithPrairieHQ(tenant: string, clientId: string, redirectUri: string) {
  const { codeVerifier, codeChallenge, state } = await generatePkce();

  // Store in sessionStorage to verify during callback
  sessionStorage.setItem('oauth_verifier', codeVerifier);
  sessionStorage.setItem('oauth_state', state);

  const params = new URLSearchParams({
    tenant,
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid profile jobs workOrders offline_access',
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state: state,
  });

  window.location.href = `https://auth.prairiehq.com/oauth/authorize?${params.toString()}`;
}
```

### Exchanging Authorization Code in Callback

```typescript
export async function handleOAuthCallback(tenant: string, clientId: string, redirectUri: string) {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const returnedState = urlParams.get('state');
  const storedState = sessionStorage.getItem('oauth_state');
  const codeVerifier = sessionStorage.getItem('oauth_verifier');

  if (!code || returnedState !== storedState || !codeVerifier) {
    throw new Error('OAuth state mismatch or missing parameters');
  }

  const response = await fetch('https://auth.prairiehq.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  const tokens = await response.json();
  // tokens.access_token, tokens.id_token, tokens.refresh_token
  return tokens;
}
```

---

## 2. Confidential Client (Node.js Backend)

Confidential clients authenticate with HTTP Basic (`client_id` + `client_secret`) and PKCE.

```typescript
import axios from 'axios';

interface TokenExchangeOptions {
  tenant: string;
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
  codeVerifier: string;
}

export async function exchangeConfidentialCode(options: TokenExchangeOptions) {
  const basicAuth = Buffer.from(`${options.clientId}:${options.clientSecret}`).toString('base64');

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: options.code,
    redirect_uri: options.redirectUri,
    code_verifier: options.codeVerifier,
  });

  const response = await axios.post(
    'https://auth.prairiehq.com/oauth/token',
    params.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
    }
  );

  return response.data;
}

export async function refreshAccessToken(
  tenant: string,
  clientId: string,
  clientSecret: string,
  refreshToken: string
) {
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const response = await axios.post(
    'https://auth.prairiehq.com/oauth/token',
    params.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
    }
  );

  return response.data; // Includes new access_token and rotated refresh_token!
}
```

---

## 3. Querying PrairieHQ GraphQL API

Once an access token is acquired, pass it in the `Authorization` header:

```typescript
export async function fetchJobs(tenant: string, accessToken: string) {
  const query = `
    query GetJobs {
      jobs(limit: 10) {
        id
        status
        targetDate
        customer {
          name
        }
      }
    }
  `;

  const response = await fetch(`https://${tenant}.prairiehq.app/api`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query }),
  });

  return await response.json();
}
```

---

## 4. cURL Testing Script

```bash
# 1. Exchange authorization code
curl -X POST 'https://auth.prairiehq.com/oauth/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=authorization_code' \
  --data-urlencode 'client_id=prairiehq-mobile' \
  --data-urlencode 'code=bugaboo.6d3bf9841...' \
  --data-urlencode 'redirect_uri=https://app.example.com/callback' \
  --data-urlencode 'code_verifier=original_random_verifier'

# 2. Query UserInfo
curl -X GET 'https://auth.prairiehq.com/oauth/userinfo' \
  -H 'Authorization: Bearer <access_token>'

# 3. Query GraphQL API
curl -X POST 'https://bugaboo.prairiehq.app/api' \
  -H 'Authorization: Bearer <access_token>' \
  -H 'Content-Type: application/json' \
  -d '{"query": "{ jobs(limit: 5) { id status } }"}'

# 4. Revoke Refresh Token
curl -X POST 'https://auth.prairiehq.com/oauth/revoke' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'client_id=prairiehq-mobile' \
  --data-urlencode 'token=bugaboo.9d023b...'
```

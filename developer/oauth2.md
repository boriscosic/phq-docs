# OAuth 2.0 & OpenID Connect Overview

PrairieHQ provides a standards-compliant **OAuth 2.0 Authorization Server** and **OpenID Connect (OIDC)** provider. This allows web applications, mobile apps, and third-party partner integrations to securely authenticate users and call the PrairieHQ GraphQL API.

---

## Supported Flow

PrairieHQ enforces **OAuth 2.0 Authorization Code Flow with mandatory PKCE (RFC 7636)** using the `S256` code challenge method.

- **Public Clients**: Single Page Applications (SPAs) and mobile apps that cannot protect a secret must authenticate using PKCE without a client secret.
- **Confidential Clients**: Server-side applications that securely store credentials must authenticate using HTTP Basic or POST credentials alongside PKCE.
- **Grant Types Not Supported**: Implicit grant, Resource Owner Password Credentials, and Client Credentials grants are explicitly disallowed for external clients.

---

## Authentication Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Browser
    participant Client as Client Application
    participant OAuth as PrairieHQ OAuth Server
    participant API as PrairieHQ GraphQL API

    Client->>Client: Generate state, nonce, and PKCE pair (verifier + S256 challenge)
    Client->>OAuth: GET /oauth/authorize?tenant=...&response_type=code&client_id=...&code_challenge=...
    OAuth-->>User: Display PrairieHQ Sign-in Screen
    User->>OAuth: Enter username and password
    OAuth-->>User: Display Scope Consent & Organization Selector
    User->>OAuth: Approve requested access
    OAuth-->>Client: 302 Redirect to redirect_uri?code=...&state=...&iss=...
    Client->>OAuth: POST /oauth/token (code + code_verifier + client_id)
    OAuth-->>Client: Return access_token (RS256 JWT), id_token, and refresh_token
    Client->>API: POST /api (Authorization: Bearer <access_token>)
    API-->>Client: GraphQL Response
```

---

## OAuth Endpoints

All OAuth and OIDC endpoints below use the canonical issuer `https://auth.prairiehq.com`. Authorization requests must include the tenant identifier as `tenant=<tenant>`.

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/.well-known/openid-configuration` | `GET` | OpenID Connect discovery metadata |
| `/.well-known/oauth-authorization-server` | `GET` | RFC 8414 OAuth authorization server metadata |
| `/oauth/jwks` | `GET` | JSON Web Key Set (RS256 public keys for JWT validation) |
| `/oauth/authorize` | `GET`, `POST` | Authorization initiation and consent submission |
| `/oauth/token` | `POST` | Token issuance (`authorization_code` or `refresh_token`) |
| `/oauth/userinfo` | `GET` | Authenticated user profile information |
| `/oauth/revoke` | `POST` | Refresh token revocation |
| `/api` | `POST` | PrairieHQ GraphQL API |

---

## Multi-Tenancy & Data Isolation

PrairieHQ routes OAuth requests within its multi-tenant architecture:
- **Tenant Prefixing**: Authorization codes and refresh tokens are opaque tokens prefixed with the tenant key (e.g., `bugaboo.<randomToken>`). This allows stateless routing to the appropriate tenant database without querying global shared state.
- **Tenant Selection**: Authorization requests use the canonical auth host and must include `tenant=<tenant>` so PrairieHQ can select the tenant context.
- **Organization Scoping**: During consent, users pick an organization membership. The issued access token is tightly bound to that `organization_guid`.

---

## Token Specifications

### Access Token
- **Format**: Signed RS256 JWT
- **Audience (`aud`)**: `https://api.prairiehq.com`
- **Lifetime**: 1 hour (`3600s`)
- **Usage**: Sent as an HTTP header: `Authorization: Bearer <access_token>` to `POST /api`

### ID Token
- **Format**: Signed RS256 JWT
- **Audience (`aud`)**: The client application's `client_id`
- **Lifetime**: 10 minutes (`600s`)
- **Usage**: Verifies identity and extracts user claims (`sub`, `name`, `email`, `preferred_username`)

### Refresh Token
- **Format**: Opaque token (`<tenant>.<random>`)
- **Lifetime**: 30 days
- **Rotation**: Rotated on every refresh. Presenting a previously consumed refresh token revokes the entire token family immediately (theft detection).

---

## Scopes Overview

### Identity Scopes
- `openid`: Enables OIDC and returns an `id_token`.
- `profile`: Returns the user's full name and username.
- `email`: Returns the user's email address.
- `offline_access`: Issues a 30-day rotating refresh token.

### API Scopes
API scopes map directly to root query and mutation fields in the PrairieHQ GraphQL API:
- `jobs`: Access to job lists, assignments, and completion reports.
- `workOrders`: Access to work orders and contracts.
- `customers`: Access to customer records, properties, and billing profiles.
- `invoices`: Access to invoice creation and payment records.
- `employees`: Access to staff rosters and schedules.

---

## Further Developer Guides

Explore the detailed reference guides below for step-by-step protocol implementation, token structures, and code examples:

- [Authorization Code Flow & PKCE](/developer/authorization-code-flow): Step-by-step protocol walkthrough, PKCE generation, request parameters, and callback handling.
- [Tokens, Scopes & Claims](/developer/tokens-and-scopes): Detailed JWT payload examples, refresh token family rotation rules, and third-party marketplace app installations.
- [Client Integration Examples](/developer/client-examples): Ready-to-use TypeScript, Browser Web Crypto, Node.js, and cURL examples.

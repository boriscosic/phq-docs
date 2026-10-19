# Tokens, Scopes & Claims

This guide describes token formats, validation rules, refresh token rotation, and scope permissions in PrairieHQ's OAuth 2.0 system.

---

## 1. Token Types

### Access Token (RS256 JWT)
Used to authenticate calls to the PrairieHQ GraphQL API (`/api`).
- **Signature Algorithm**: `RS256`
- **Lifetime**: 1 hour (`3600s`)
- **Audience (`aud`)**: `https://api.prairiehq.com`
- **Issuer (`iss`)**: `https://auth.prairiehq.com`

#### Access Token Claims Example

```json
{
  "sub": "b2f67954-41d4-4bb8-9366-ebc77d4c114e",
  "aud": "https://api.prairiehq.com",
  "iss": "https://auth.prairiehq.com",
  "token_use": "access",
  "client_id": "prairiehq-mobile",
  "scope": "openid profile jobs workOrders",
  "tenant": "bugaboo",
  "organization_guid": "70d24e18-6c84-486d-a77f-1dcf2a6bf494",
  "data": {
    "tenant": "bugaboo",
    "organization_guid": "70d24e18-6c84-486d-a77f-1dcf2a6bf494",
    "role": "manager",
    "user_id": 42
  },
  "exp": 1776535200,
  "iat": 1776531600,
  "jti": "e67ba053-1250-4886-9a57-19aa43fa3055"
}
```

---

### ID Token (RS256 JWT)
Returned when the `openid` scope is requested. Designed for the client application to establish local session identity.
- **Signature Algorithm**: `RS256`
- **Lifetime**: 10 minutes (`600s`)
- **Audience (`aud`)**: The client application's `client_id`
- **Issuer (`iss`)**: `https://auth.prairiehq.com`

#### ID Token Claims Example

```json
{
  "sub": "b2f67954-41d4-4bb8-9366-ebc77d4c114e",
  "aud": "prairiehq-mobile",
  "iss": "https://auth.prairiehq.com",
  "token_use": "id",
  "nonce": "xyzNonce456",
  "name": "Boris Doe",
  "preferred_username": "boris",
  "email": "boris@example.com",
  "tenant": "bugaboo",
  "organization_guid": "70d24e18-6c84-486d-a77f-1dcf2a6bf494",
  "exp": 1776532200,
  "iat": 1776531600,
  "jti": "2cf41bc5-84e0-410a-8bf8-d3e91d84fbb7"
}
```

---

### Refresh Token (Opaque with Tenant Prefix)
Returned when the `offline_access` scope is requested.
- **Format**: `<tenant>.<64-character-hex-random>` (e.g., `bugaboo.6d82f3...`)
- **Lifetime**: 30 days
- **Storage**: SHA-256 hashed on the authorization server

#### Refresh Token Family Rotation & Reuse Detection
PrairieHQ implements strict **Token Family Rotation**:
1. When a refresh token is exchanged at `/oauth/token` with `grant_type=refresh_token`, PrairieHQ atomically marks it as consumed and issues a brand-new replacement refresh token in the same token family.
2. **Theft Detection**: If an already-consumed refresh token is presented again (indicating potential token interception), PrairieHQ immediately revokes the **entire token family**, invalidating all active sessions for that authorization.

---

## 2. Scopes Reference

PrairieHQ divides scopes into two tiers: **Identity Scopes** and **API Scopes**.

### Identity Scopes

| Scope | Description | Grants GraphQL Access? |
| :--- | :--- | :--- |
| `openid` | Requests OpenID Connect authentication and returns an `id_token`. | No |
| `profile` | Includes `name` and `preferred_username` in ID token and UserInfo. | No |
| `email` | Includes verified `email` in ID token and UserInfo. | No |
| `offline_access` | Issues a rotating refresh token for background token renewal. | No |

### API Scopes (GraphQL Root Fields)

Every API scope directly gates access to the corresponding GraphQL root query and mutation fields in the PrairieHQ API. Examples include:

- `jobs`: Allows querying `job`, `jobs`, and invoking job mutations.
- `workOrders`: Allows querying `workOrder`, `workOrders`, and work order lifecycle mutations.
- `customers`: Access to customer records, properties, and billing profiles.
- `invoices`: Access to invoice queries and payment recording.
- `employees`: Access to employee roster and wage configuration.
- `dailyFinancials`: Access to daily revenue and thermometer metrics.
- `snowRemovalLogs`: Access to commercial winter logs and weather events.

---

## 3. Third-Party Marketplace Client Scopes & Installations

For external or third-party applications requiring organization installation:
1. The client is registered with a set of maximum `allowedScopes`.
2. Before the application can access any organization data, an **Organization Administrator** must install the app in PrairieHQ under **Account → Integrations → OAuth Apps**.
3. During installation, the administrator selects the specific scopes permitted for their organization.
4. If an application requests a scope that was not approved by the administrator during installation, the authorization request will be rejected with `access_denied`.

---

## 4. UserInfo Endpoint

Send a `GET` request to `/oauth/userinfo` with the access token:

```bash
curl -X GET 'https://auth.prairiehq.com/oauth/userinfo' \
  -H 'Authorization: Bearer <access_token>'
```

Response:

```json
{
  "sub": "b2f67954-41d4-4bb8-9366-ebc77d4c114e",
  "tenant": "bugaboo",
  "organization_guid": "70d24e18-6c84-486d-a77f-1dcf2a6bf494",
  "name": "Boris Doe",
  "preferred_username": "boris",
  "email": "boris@example.com"
}
```

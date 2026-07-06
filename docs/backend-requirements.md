# SQH Backend Requirements

This document describes the backend services needed to replace the current frontend-only data and admin placeholders in the SQH React/Vite storefront.

## Current Frontend State

- Product data is hardcoded in `src/data/products.js` and `src/data/essentialGear.js`.
- Admin login is hardcoded in `src/pages/AdminLogin.jsx` and stores `sqh_admin_authenticated=true` in `localStorage`.
- Admin product upload builds a `FormData` payload but does not send it yet.
- Cart state is stored in `localStorage` under `sqh_cart_items`.
- Checkout collects shipping details visually, but does not submit an order or payment.

## Backend Priorities

1. Admin authentication and session/token validation.
2. Product catalog APIs for public storefront pages.
3. Protected admin product CRUD APIs.
4. Product image upload and storage.
5. Order creation from checkout.
6. Optional payment provider integration.

## Environment Variables

Frontend:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Backend:

```env
DATABASE_URL=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
CORS_ORIGIN=http://localhost:5173
UPLOAD_STORAGE_PROVIDER=local
UPLOAD_MAX_MB=10
PAYMENT_PROVIDER=stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Use hashed admin passwords only. Do not store plain-text passwords in backend config or frontend code.

## Authentication

### POST `/api/admin/auth/login`

Authenticates an admin user.

Request:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

Response:

```json
{
  "admin": {
    "id": "admin_123",
    "email": "admin@example.com",
    "role": "admin"
  },
  "accessToken": "jwt_access_token",
  "expiresIn": 3600
}
```

Recommended behavior:

- Validate email and password server-side.
- Compare passwords with a secure hash such as bcrypt or Argon2.
- Return `401` for invalid credentials.
- Rate-limit repeated failed logins.
- Prefer an `HttpOnly`, `Secure`, `SameSite` cookie for production sessions. A bearer token is also acceptable if the frontend stores it carefully.

### POST `/api/admin/auth/logout`

Logs the admin out. Required if using cookie sessions or refresh tokens.

Response:

```json
{
  "success": true
}
```

### GET `/api/admin/auth/me`

Returns the currently authenticated admin.

Headers:

```http
Authorization: Bearer <accessToken>
```

Response:

```json
{
  "id": "admin_123",
  "email": "admin@example.com",
  "role": "admin"
}
```

Protected admin routes should use this endpoint instead of trusting `localStorage`.

## Product Model

Products should support both current storefront data and admin inventory fields.

```json
{
  "id": "prod_123",
  "slug": "quest-master-tee-white",
  "title": "QUEST MASTER TEE / WHITE",
  "description": "Product description",
  "price": 55,
  "currency": "USD",
  "category": "training",
  "badge": "BESTSELLER",
  "sku": "SQH-BAS-042",
  "sizes": ["S", "M", "L"],
  "stock": 42,
  "images": [
    {
      "id": "img_123",
      "url": "https://cdn.example.com/products/prod_123/main.jpg",
      "alt": "QUEST MASTER TEE / WHITE",
      "isPrimary": true
    }
  ],
  "isFeatured": false,
  "isActive": true,
  "createdAt": "2026-07-06T10:00:00.000Z",
  "updatedAt": "2026-07-06T10:00:00.000Z"
}
```

Use one consistent price format. The frontend currently has both numbers and strings like `"$180"`; the backend should return numeric prices in cents or decimal numbers. Numeric cents are safest for payment work.

Recommended categories:

- `outerwear`
- `training`
- `accessories`
- `footwear`

Recommended sizes:

- Apparel: `XS`, `S`, `M`, `L`, `XL`, `XXL`
- Footwear: `7`, `8`, `9`, `10`, `11`, etc.
- One-size items: `OS`

## Public Product Endpoints

### GET `/api/products`

Returns active products for the shop page.

Query parameters:

- `search`
- `category`
- `size`
- `minPrice`
- `maxPrice`
- `sort`: `newest`, `price_asc`, `price_desc`, `best_sellers`
- `page`
- `limit`

Response:

```json
{
  "items": [
    {
      "id": "prod_123",
      "slug": "quest-master-tee-white",
      "title": "QUEST MASTER TEE / WHITE",
      "price": 55,
      "currency": "USD",
      "category": "training",
      "badge": "BESTSELLER",
      "sizes": ["S", "M", "L"],
      "src": "https://cdn.example.com/products/prod_123/main.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 6,
    "total": 20,
    "totalPages": 4
  }
}
```

The frontend currently expects `src` for the primary image, so either return `src` directly or map `images[0].url` in the frontend API adapter.

### GET `/api/products/:idOrSlug`

Returns a single active product for the detail page.

Response:

```json
{
  "id": "prod_123",
  "slug": "quest-master-tee-white",
  "title": "QUEST MASTER TEE / WHITE",
  "description": "Product description",
  "price": 55,
  "currency": "USD",
  "category": "training",
  "sizes": ["S", "M", "L"],
  "stock": 42,
  "images": [],
  "relatedProducts": []
}
```

Return `404` if the product is missing or inactive.

## Admin Product Endpoints

All admin endpoints require authentication.

Headers:

```http
Authorization: Bearer <accessToken>
```

### GET `/api/admin/products`

Returns products for the admin inventory table, including inactive products and stock fields.

Query parameters:

- `search`
- `category`
- `status`: `active`, `inactive`, `all`
- `page`
- `limit`

### POST `/api/admin/products`

Creates a product. This matches the current `ProductUpload.jsx` `FormData` shape.

Content type:

```http
multipart/form-data
```

Fields:

- `name` or `title`: string, required
- `category`: string, required
- `price`: number, required
- `description`: string
- `sizes`: JSON string array, example `["M","L"]`
- `sku`: string, optional
- `stock`: number, optional
- `image`: file, optional

Response:

```json
{
  "id": "prod_123",
  "title": "QUEST MASTER TEE / WHITE",
  "price": 55,
  "category": "training",
  "sizes": ["M", "L"],
  "src": "https://cdn.example.com/products/prod_123/main.jpg"
}
```

### PATCH `/api/admin/products/:id`

Updates product details.

Request:

```json
{
  "title": "APEX PREDATOR RUNNER",
  "price": 245,
  "category": "footwear",
  "description": "Updated description",
  "sku": "SQH-AP-001",
  "stock": 42,
  "sizes": ["10", "11"],
  "isActive": true
}
```

### DELETE `/api/admin/products/:id`

Soft-deletes or deactivates a product. Prefer soft delete so old orders still keep valid product references.

Response:

```json
{
  "success": true
}
```

### POST `/api/admin/products/:id/images`

Uploads or replaces product images.

Content type:

```http
multipart/form-data
```

Fields:

- `image`: file, required
- `alt`: string, optional
- `isPrimary`: boolean, optional

Response:

```json
{
  "id": "img_123",
  "url": "https://cdn.example.com/products/prod_123/main.jpg",
  "alt": "QUEST MASTER TEE / WHITE",
  "isPrimary": true
}
```

## Order And Checkout Endpoints

### POST `/api/orders`

Creates an order from checkout.

Request:

```json
{
  "customer": {
    "name": "Alex Mercer",
    "email": "alex@example.com"
  },
  "shippingAddress": {
    "line1": "777 Discipline Boulevard",
    "city": "New York",
    "postalCode": "10001",
    "country": "US"
  },
  "items": [
    {
      "productId": "prod_123",
      "size": "M",
      "quantity": 2
    }
  ]
}
```

Response:

```json
{
  "id": "order_123",
  "status": "pending_payment",
  "subtotal": 110,
  "tax": 8.8,
  "shipping": 0,
  "total": 118.8,
  "currency": "USD"
}
```

Important:

- Recalculate all prices on the backend from current product data.
- Validate product availability, selected size, stock, and quantity.
- Do not trust cart totals from the browser.

### POST `/api/orders/:id/payment-intent`

Creates a payment intent or checkout session with the selected payment provider.

Response:

```json
{
  "clientSecret": "payment_client_secret",
  "orderId": "order_123"
}
```

### POST `/api/webhooks/payment`

Receives payment provider webhooks.

Expected responsibilities:

- Verify webhook signatures.
- Mark orders as `paid`, `failed`, `refunded`, or `cancelled`.
- Reduce inventory after successful payment.
- Send confirmation emails if email service is configured.

## Order Model

```json
{
  "id": "order_123",
  "status": "pending_payment",
  "customerEmail": "alex@example.com",
  "customerName": "Alex Mercer",
  "shippingAddress": {},
  "items": [
    {
      "productId": "prod_123",
      "title": "QUEST MASTER TEE / WHITE",
      "size": "M",
      "unitPrice": 55,
      "quantity": 2,
      "lineTotal": 110
    }
  ],
  "subtotal": 110,
  "tax": 8.8,
  "shipping": 0,
  "total": 118.8,
  "currency": "USD",
  "paymentProvider": "stripe",
  "paymentReference": "pi_123",
  "createdAt": "2026-07-06T10:00:00.000Z"
}
```

## Admin Dashboard Data

The current dashboard page is mostly static. Useful future endpoints:

### GET `/api/admin/dashboard/summary`

Response:

```json
{
  "totalProducts": 24,
  "activeProducts": 20,
  "lowStockProducts": 3,
  "pendingOrders": 4,
  "revenueToday": 480
}
```

### GET `/api/admin/orders`

Returns order management data when the admin orders page is enabled.

## Validation Rules

- `title`: required, 2-120 characters.
- `price`: required, positive number or integer cents.
- `category`: required, one of the allowed categories.
- `sizes`: required array with at least one value.
- `stock`: integer, minimum `0`.
- `sku`: unique when provided.
- `image`: accept `jpg`, `jpeg`, `png`, `webp`; enforce max file size.
- `email`: valid email format.
- `quantity`: integer from `1` to available stock.

## Security Requirements

- Never expose admin credentials in frontend code.
- Hash passwords with bcrypt or Argon2.
- Protect all `/api/admin/*` endpoints.
- Enable CORS only for the frontend origin.
- Validate and sanitize all request bodies.
- Rate-limit login and mutation endpoints.
- Use HTTPS in production.
- Store uploaded files outside the app source tree or in object storage.
- Generate safe filenames; never trust uploaded filenames.
- Return generic auth errors, not whether an email exists.

## Suggested Database Tables

- `admins`
- `products`
- `product_images`
- `product_variants` or `product_sizes`
- `orders`
- `order_items`
- `payments`

## Frontend Integration Checklist

- Replace `src/utils/adminAuth.js` with API-backed auth helpers.
- Replace hardcoded login constants in `src/pages/AdminLogin.jsx`.
- Update `ProtectedAdminRoute.jsx` to call `/api/admin/auth/me`.
- Replace imports from `src/data/products.js` and `src/data/essentialGear.js` with `GET /api/products`.
- Wire `ProductUpload.jsx` submit to `POST /api/admin/products`.
- Wire `ProductEdit.jsx` load/save/delete to admin product endpoints.
- Wire checkout submit to `POST /api/orders`, then payment intent/session creation.
- Normalize product price handling in `CartContext.jsx` after backend response shape is chosen.

## Minimum Viable Backend

For the first working backend pass, implement:

1. `POST /api/admin/auth/login`
2. `GET /api/admin/auth/me`
3. `GET /api/products`
4. `GET /api/products/:idOrSlug`
5. `GET /api/admin/products`
6. `POST /api/admin/products`
7. `PATCH /api/admin/products/:id`
8. `DELETE /api/admin/products/:id`

Orders and payments can come after product/admin management is stable.

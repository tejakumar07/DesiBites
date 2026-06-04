# 🍛 DesiBites — Taste the Real India

DesiBites is a modern, premium, and fully-featured online food ordering web application specializing in authentic Indian cuisine. Built with a robust full-stack architecture, it offers users a seamless journey from browsing mouth-watering traditional dishes to placing orders, tracking deliveries in real-time, and generating printable invoice receipts.

---

## ✨ Features

### 🎨 Frontend (Client)
- **Vibrant & Responsive Design:** Sleek modern aesthetics utilizing **Tailwind CSS v4** and Google Fonts (Inter).
- **Interactive Menu:** Browse delicious Indian dishes, filter by **Veg/Non-Veg** culinary symbols (conforming to Indian standard labeling), and search in real-time.
- **Cart Management:** Dynamic add-to-cart functionality with real-time total price updating, persistent state via **React Context**, and visual feedback animations.
- **Seamless Checkout:** Simple user information capture (Name, Phone, Address) with loading states and order confirmation.
- **Real-Time Order Tracking:** Visual step-by-step progress timeline of the order status (Order Placed ➡️ Preparing Food ➡️ Out for Delivery ➡️ Delivered) with periodic 5-second polling updates.
- **Invoice Generation & Printing:** A premium, styled receipt detailing the subtotal, GST (5%), delivery fees (free for orders above ₹499), and customer information, ready for browser printing (`window.print()`).

### ⚙️ Backend (Server)
- **RESTful API Architecture:** Scalable Express-based routing structure separating routes, controllers, and services.
- **Database & Prisma ORM:** Type-safe database queries leveraging **Prisma Client** and a PostgreSQL database (hosted on Supabase).
- **Zod Schema Validation:** Rigorous data integrity for order placements — validates name, address (10–100 chars), phone (Indian 10-digit), items array, and quantity constraints.
- **Simulated Order Status:** Time-based automatic status progression: `Order Received` → `Preparing` → `Out for Delivery` → `Delivered`.
- **Manual Status Override:** `PATCH` endpoint to manually update order status with enum validation.
- **Pre-configured Seed Script:** Automatic menu population with staple dishes (Paneer Tikka Roll, Veg Hyderabadi Biryani, Palak Paneer, Chicken 65, etc.).

---

## 🛠️ Tech Stack

| Layer       | Technologies                                                              |
|-------------|---------------------------------------------------------------------------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, React Router DOM v7, Axios, Phosphor Icons |
| **Backend**  | Node.js, Express 5, TypeScript, Prisma ORM, Zod v4, PostgreSQL           |
| **Testing**  | Vitest, Supertest (API integration tests with mocked Prisma)              |
| **DevOps**   | Docker (multi-stage build), Google Cloud Run, Secret Manager              |

---

## 📂 Project Directory Structure

```text
DesiBites/
├── client/                         # Frontend React Application
│   ├── src/
│   │   ├── components/             # Reusable UI (NavBar, Footer, MenuItems, etc.)
│   │   ├── context/                # React Context (CartContext)
│   │   ├── Pages/                  # Page views (Landing, Home, Cart, Checkout, TrackOrder, OrderDetails)
│   │   ├── lib/                    # Utility classes/helpers
│   │   ├── App.tsx                 # Main routing configuration
│   │   ├── index.css               # Global Tailwind directives and custom styles
│   │   └── main.tsx                # React application entry point
│   ├── package.json
│   └── vite.config.ts              # Vite configuration + API Proxy setup
│
├── server/                         # Backend Node.js & Express API
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema (MenuItem, Order, OrderItem)
│   │   └── seed.ts                 # Seeding script with dummy menu items
│   ├── src/
│   │   ├── config/                 # Database connection (Prisma client export)
│   │   ├── controllers/            # Request handling logic (menu, order)
│   │   ├── routes/                 # Express API routing definitions
│   │   ├── services/               # Business logic / DB operations layer
│   │   ├── utils/                  # Utility helpers (calculateStatus)
│   │   ├── tests/                  # Test suites
│   │   │   ├── __mocks__/          # Prisma client mock
│   │   │   │   └── prisma.ts
│   │   │   ├── menu.test.ts        # Menu API endpoint tests
│   │   │   ├── order.test.ts       # Order API endpoint tests (CRUD + validation)
│   │   │   └── orderStatus.test.ts # Status utility unit tests
│   │   ├── app.ts                  # Express app setup and middleware
│   │   └── index.ts                # Server entry point
│   ├── Dockerfile                  # Multi-stage Docker build for Cloud Run
│   ├── cloudrun.yaml               # Cloud Run service manifest
│   ├── .dockerignore
│   ├── .env                        # Environment variables (local only)
│   └── package.json
│
└── README.md                       # This file
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- A running [PostgreSQL](https://www.postgresql.org/) database (or a hosted [Supabase](https://supabase.com/) instance)

---

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment — create a .env file
echo 'DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"' > .env

# Push the Prisma schema to PostgreSQL & generate the client
npx prisma db push
npx prisma generate

# Seed the database with menu items
npx tsx prisma/seed.ts

# Start the development server
npx tsx src/index.ts
```

> The server runs on **`http://localhost:8080`**.

---

### 2. Frontend Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Start the dev server
npm run dev
```

> The client runs on **`http://localhost:5173`**. Vite automatically proxies `/api/*` requests to `http://localhost:8080`.

---

## 🔌 API Endpoints Reference

### Menu Endpoints — `/api/menu`

| Method | Endpoint         | Description                          |
|--------|------------------|--------------------------------------|
| `GET`  | `/api/menu`      | Retrieve all available menu items    |
| `GET`  | `/api/menu/:id`  | Fetch details of a specific item     |

### Order Endpoints — `/api/orders`

| Method  | Endpoint                 | Description                                  |
|---------|--------------------------|----------------------------------------------|
| `POST`  | `/api/orders`            | Place a new order                            |
| `GET`   | `/api/orders/:id`        | Retrieve full order details (with totalPrice)|
| `GET`   | `/api/orders/:id/status` | Get current tracking status                  |
| `PATCH` | `/api/orders/:id/status` | Manually update order status                 |

### Order Placement — Request Body (`POST /api/orders`)

```json
{
  "name": "Rahul Sharma",
  "address": "42 MG Road, Bengaluru, Karnataka",
  "phone": "9876543210",
  "items": [
    { "menuItemId": 1, "quantity": 2 },
    { "menuItemId": 3, "quantity": 1 }
  ]
}
```

**Validation Rules (Zod):**
| Field       | Rule                                          |
|-------------|-----------------------------------------------|
| `name`      | Required string                               |
| `address`   | 10–100 characters                             |
| `phone`     | Indian mobile — 10 digits starting with 6–9   |
| `items`     | Non-empty array with at least 1 item          |
| `menuItemId`| Positive integer                              |
| `quantity`  | Positive integer, max 100                     |

### Status Update — Request Body (`PATCH /api/orders/:id/status`)

```json
{
  "status": "Preparing"
}
```

**Allowed status values:** `"Order Received"` | `"Preparing"` | `"Out for Delivery"` | `"Delivered"`

---

## 🧪 Testing

The project includes a comprehensive test suite covering API endpoints, input validation, and the order status utility function.

### Test Framework
- **Vitest** — Native ESM + TypeScript support
- **Supertest** — HTTP integration testing against the Express app
- **Prisma Mock** — All database calls are mocked (no real DB required)

### Test Coverage Summary

| Test File              | Tests | What's Covered                                                             |
|------------------------|-------|----------------------------------------------------------------------------|
| `menu.test.ts`         | 7     | List all items, get by ID, empty states, required fields, DB error handling |
| `order.test.ts`        | 28    | Place order (valid + 9 validation cases), get by ID, get status (4 time phases), update status (valid + 3 invalid), DB errors |
| `orderStatus.test.ts`  | 9     | `calculateStatus()` utility — boundary tests for all 4 status transitions  |
| **Total**              | **44**| **All passing ✅**                                                         |

### Running the Tests

```bash
cd server

# Run the full test suite
npm test

# Run tests in watch mode (for development)
npx vitest

# Run a specific test file
npx vitest run src/tests/order.test.ts
```

### Test Details

**Menu API Tests (`menu.test.ts`)**
- ✅ Returns all menu items with 200 status
- ✅ Returns empty array when no items exist
- ✅ Each item contains required fields (id, name, description, price, imageUrl, isVeg)
- ✅ Returns single item by ID
- ✅ Returns null for non-existent item
- ✅ Returns 500 on database errors

**Order API Tests (`order.test.ts`)**
- ✅ Creates order with valid payload → 201
- ✅ Rejects missing name → 400
- ✅ Rejects short address (< 10 chars) → 400
- ✅ Rejects long address (> 100 chars) → 400
- ✅ Rejects invalid phone numbers (non-Indian format) → 400
- ✅ Rejects empty items array → 400
- ✅ Rejects missing items field → 400
- ✅ Rejects zero quantity → 400
- ✅ Rejects negative menuItemId → 400
- ✅ Rejects quantity > 100 → 400
- ✅ Returns order details with totalPrice calculation
- ✅ Returns 400 for non-existent order
- ✅ Time-based status: Order Received (< 45s), Preparing (45s–2.5m), Out for Delivery (2.5–5m), Delivered (> 5m)
- ✅ Preserves manually set status (doesn't override with calculateStatus)
- ✅ Returns 404 for non-existent order status
- ✅ Updates status to Preparing / Out for Delivery / Delivered → 200
- ✅ Rejects invalid status values (e.g., "Cancelled") → 400
- ✅ Rejects empty/missing status body → 400
- ✅ Handles DB errors → 500

**Order Status Utility Tests (`orderStatus.test.ts`)**
- ✅ Returns `Order Received` for orders placed < 45 seconds ago
- ✅ Returns `Preparing` between 45 seconds and 2.5 minutes
- ✅ Returns `Out for Delivery` between 2.5 and 5 minutes
- ✅ Returns `Delivered` for orders placed ≥ 5 minutes ago
- ✅ Handles boundary values at each transition point

---

## ☁️ Deploying to Google Cloud Run

### Prerequisites

1. **Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)**
2. **Authenticate and set your project:**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```
3. **Enable required APIs:**
   ```bash
   gcloud services enable \
     run.googleapis.com \
     cloudbuild.googleapis.com \
     secretmanager.googleapis.com \
     artifactregistry.googleapis.com
   ```

---

### Step 1 — Store Secrets in Secret Manager

Store your database URL securely (never bake it into the Docker image):

```bash
# Create the DATABASE_URL secret
echo -n "postgresql://USER:PASS@HOST:5432/DB?schema=public" | \
  gcloud secrets create DATABASE_URL --data-file=-

# Grant the Cloud Run service account access to the secret
gcloud secrets add-iam-policy-binding DATABASE_URL \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

> Replace `YOUR_PROJECT_NUMBER` with your actual GCP project number (find it via `gcloud projects describe YOUR_PROJECT_ID --format='value(projectNumber)'`).

---

### Step 2 — Build & Push the Server Docker Image

From the **server** directory:

```bash
cd server

# Option A: Build with Cloud Build (recommended — no local Docker needed)
gcloud builds submit \
  --tag gcr.io/YOUR_PROJECT_ID/desibites-server:latest .

# Option B: Build locally and push
docker build -t gcr.io/YOUR_PROJECT_ID/desibites-server:latest .
docker push gcr.io/YOUR_PROJECT_ID/desibites-server:latest
```

---

### Step 3 — Deploy to Cloud Run

**Option A: Quick deploy via CLI**

```bash
gcloud run deploy desibites-server \
  --image gcr.io/YOUR_PROJECT_ID/desibites-server:latest \
  --region asia-south1 \
  --platform managed \
  --port 8080 \
  --allow-unauthenticated \
  --set-secrets "DATABASE_URL=DATABASE_URL:latest" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

**Option B: Deploy using the provided `cloudrun.yaml` manifest**

1. Open `server/cloudrun.yaml` and replace all occurrences of `YOUR_PROJECT_ID` with your actual GCP project ID.
2. Deploy:
   ```bash
   gcloud run services replace cloudrun.yaml --region=asia-south1
   ```
3. Allow public access:
   ```bash
   gcloud run services add-iam-policy-binding desibites-server \
     --region=asia-south1 \
     --member="allUsers" \
     --role="roles/run.invoker"
   ```

---

### Step 4 — Build & Deploy the Client

The client is a static Vite/React app. You can deploy it to **Firebase Hosting**, **Cloud Storage + CDN**, or **another Cloud Run service**.

**Quick approach — serve the client from a Cloud Run container:**

1. Create `client/Dockerfile`:
   ```dockerfile
   FROM node:22-alpine AS builder
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci
   COPY . .
   ENV VITE_API_URL=https://desibites-server-XXXXXXXX-el.a.run.app
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 8080
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. Create `client/nginx.conf`:
   ```nginx
   server {
       listen 8080;
       root /usr/share/nginx/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api/ {
           proxy_pass https://desibites-server-XXXXXXXX-el.a.run.app;
           proxy_set_header Host $host;
       }
   }
   ```

3. Build and deploy:
   ```bash
   cd client
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/desibites-client:latest .
   gcloud run deploy desibites-client \
     --image gcr.io/YOUR_PROJECT_ID/desibites-client:latest \
     --region asia-south1 \
     --platform managed \
     --port 8080 \
     --allow-unauthenticated
   ```

> Replace `desibites-server-XXXXXXXX-el.a.run.app` with your actual Cloud Run server URL (shown after server deployment).

---

### Step 5 — Verify Deployment

```bash
# Get the deployed service URL
gcloud run services describe desibites-server --region=asia-south1 --format='value(status.url)'

# Test the health endpoint
curl https://YOUR_SERVICE_URL/health

# Test the menu endpoint
curl https://YOUR_SERVICE_URL/api/menu
```

---

## 🔧 Environment Variables

| Variable        | Required | Description                              | Used By  |
|-----------------|----------|------------------------------------------|----------|
| `DATABASE_URL`  | ✅       | PostgreSQL connection string              | Server   |
| `PORT`          | ❌       | Server port (default: `8080`)             | Server   |
| `NODE_ENV`      | ❌       | Environment mode (`production`/`development`) | Server |
| `VITE_API_URL`  | ❌       | API base URL for production client build  | Client   |

---

## 📜 Available Scripts

### Server (`cd server`)

| Script              | Command                     | Description                        |
|---------------------|-----------------------------|------------------------------------|
| `npm run dev`       | `tsx watch src/index.ts`    | Start dev server with hot reload   |
| `npm run build`     | `tsc --outDir dist ...`    | Compile TypeScript to `dist/`      |
| `npm start`         | `node dist/index.js`       | Start the compiled production server |
| `npm test`          | `vitest run`               | Run the full test suite (44 tests) |
| `npm run db:generate` | `prisma generate`       | Regenerate the Prisma client       |
| `npm run db:migrate`  | `prisma migrate deploy` | Apply pending migrations           |

### Client (`cd client`)

| Script              | Command            | Description                     |
|---------------------|--------------------|---------------------------------|
| `npm run dev`       | `vite`             | Start Vite dev server           |
| `npm run build`     | `tsc -b && vite build` | Build for production        |
| `npm run preview`   | `vite preview`     | Preview the production build    |
| `npm run lint`      | `eslint .`         | Run ESLint checks               |

---

## 📄 License

ISC

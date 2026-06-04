# 🍛 DesiBites - Taste the Real India

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
- **Zod Schema Validation:** Rigorous data integrity for order placements.
- **Pre-configured Seed Script:** Automatic menu population with staple dishes (Paneer Tikka Roll, Veg Hyderabadi Biryani, Palak Paneer, Chicken 65, etc.).

---

## 🛠️ Tech Stack

### Frontend
* **Core:** React 19, TypeScript, Vite
* **Styling:** Tailwind CSS v4, Phosphor Icons (for premium micro-interactions and iconography)
* **Routing:** React Router DOM (v7)
* **State Management:** React Context API
* **API Client:** Axios

---

## 📂 Project Directory Structure

```text
DesiBites/
├── client/                     # Frontend React Application
│   ├── src/
│   │   ├── assets/             # Media and asset files
│   │   ├── components/         # Reusable UI Components (NavBar, Footer, MenuItems, etc.)
│   │   ├── context/            # React Context (CartContext)
│   │   ├── Pages/              # Page views (LandingPage, HomePage, CartPage, CheckoutPage, TrackOrder, OrderDetails)
│   │   ├── lib/                # Utility classes/helpers
│   │   ├── App.tsx             # Main routing configuration
│   │   ├── index.css           # Global Tailwind directives and custom styles
│   │   └── main.tsx            # React application entry point
│   ├── package.json
│   └── vite.config.ts          # Vite configuration + API Proxy setup
│
├── server/                     # Backend Node.js & Express API
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema modeling MenuItem, Order, and OrderItem
│   │   └── seed.ts             # Seeding script with dummy menu items
│   ├── src/
│   │   ├── config/             # Database connection setups
│   │   ├── controllers/        # Request handling logic
│   │   ├── routes/             # Express API routing definition
│   │   ├── services/           # Business logic layer
│   │   ├── utils/              # Utility helpers
│   │   ├── app.ts              # Express app setup and middleware registration
│   │   └── index.ts            # Server port listener entry point
│   ├── .env                    # Database URL and environment configurations
│   └── package.json
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started & Setup

### Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* A running [PostgreSQL](https://www.postgresql.org/) database or a hosted Supabase project instance

---

### 1. Backend Setup

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of the `/server` directory and define your `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>?schema=public"
   ```

4. **Initialize Prisma Database:**
   Push the Prisma schema to configure the tables in your PostgreSQL database, and generate the client code:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Seed the Menu Items:**
   Populate the database with authentic Indian food items:
   ```bash
   npx tsx prisma/seed.ts
   ```

6. **Start the server:**
   ```bash
   npx tsx src/index.ts
   ```
   *The server runs locally on **`http://localhost:3000`**.*

---

### 2. Frontend Setup

1. **Navigate to the client directory:**
   ```bash
   cd ../client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   *The client dev server will spin up, typically on **`http://localhost:5173`**. Vite is pre-configured to proxy `/api/*` requests directly to `http://localhost:3000`.*

---

## 🔌 API Endpoints Reference

### Menu Endpoints (`/api/menu`)
* `GET /api/menu` - Retrieve list of all available menu items.
* `GET /api/menu/:id` - Fetch details of a specific menu item.

### Order Endpoints (`/api/orders`)
* `POST /api/orders` - Place a new order. Requires customer name, address, phone, and cart items.
* `GET /api/orders/:id` - Retrieve full details of an order (used for the printable invoice receipt).
* `GET /api/orders/:id/status` - Fetch the tracking status of an order (e.g., "Order Received", "Preparing", "Out for Delivery", "Delivered").

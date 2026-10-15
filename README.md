# Adspot — Centralized Offline Advertising Spaces Marketplace

> **"Every Space Has an Audience. Find Yours with Adspot."**

Adspot is a modern, responsive, full-stack advertising-technology marketplace connecting advertisers with owners and operators of physical offline advertising spaces (billboards, bus wraps, transit media, posters, flyers, and retail commercial placements).

---

## 🚀 Technology Stack

### Frontend (`client/`)
- **React 19 + Vite** with **TypeScript**
- **Tailwind CSS v3** with custom Adspot brand tokens
- **React Router v7** for single-page routing
- **Framer Motion** for smooth transitions and accessible micro-interactions
- **Lucide React** for icons
- **Recharts** for admin portal analytics and distribution charts
- **React Leaflet + OpenStreetMap** for interactive geospatial map discovery
- **Axios** with central authorization interceptors

### Backend (`server/`)
- **Node.js + Express** (ES Modules)
- **MongoDB Atlas / Local MongoDB** with **Mongoose ODM**
- **2dsphere Geospatial Indexing** for coordinate queries and proximity discovery
- **Bcrypt.js** & **JSON Web Tokens (JWT)** for secure authentication & RBAC
- **Cloudinary** integration with automatic local disk storage fallback
- **Razorpay** payment gateway integration with server-side HMAC signature verification
- **Express Rate Limit & Helmet** for API security and spam mitigation

---

## 📁 Project Architecture

```
adspott/
├── client/                     # React + Vite + TypeScript Frontend
│   ├── public/
│   │   └── assets/             # Brand logos, mascots, and illustrations
│   ├── src/
│   │   ├── components/         # Navbar, Footer, Modal, Button, Badge, Skeletons
│   │   ├── context/            # AuthContext, SavedContext, NotificationContext
│   │   ├── pages/              # Home, Explore, Detail, Maps, SavedOrders, Profile, Admin
│   │   ├── services/           # Axios API client
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Main routing setup
│   │   └── index.css           # Base styles, Leaflet CSS & Tailwind directives
│   ├── tailwind.config.js      # Brand color palette configuration
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # db.js, cloudinary.js, razorpay.js
│   ├── controllers/            # auth, listings, bookings, payments, maps, admin
│   ├── middleware/             # auth.js (JWT/RBAC), rateLimiter.js
│   ├── models/                 # Mongoose schemas (10 collections)
│   ├── routes/                 # Express REST API routes
│   ├── services/               # insightsService.js, notificationService.js
│   ├── scripts/                # seed.js, bootstrapAdmin.js
│   └── server.js               # Express application entrypoint
│
└── README.md
```

---

## 🗄️ Database Models (Mongoose)

1. **Users:** Role-based access (`advertiser`, `space_owner`, `admin`), hashed passwords, company details, preferences.
2. **Listings:** Category, format, dimensions, 2dsphere location `[lng, lat]`, images, pricing unit, `verificationStatus` (`pending`, `approved`, `rejected`), booked date ranges.
3. **Bookings:** Advertiser, provider, date ranges, transparent pricing breakdown (space charges, platform fee, optional managed fee, GST), status tracking.
4. **SavedListings:** Unique compound index `(user, listing)`.
5. **Notifications:** In-app alerts for verification updates, booking confirmations, payment events.
6. **Payments:** Razorpay order ID, payment ID, signature, status, webhook reconciliation.
7. **PremiumEntitlements:** Heatmap access passes (`24h_pass`, `monthly_pro`) with expiration enforcement.
8. **ManagedCampaigns:** Advertiser briefs, campaign objectives, budget, operational status pipeline.
9. **ContactEnquiries:** Inquiries, contact details, internal admin resolution status.
10. **AdminAuditLogs:** Administrative action audit trail with admin references and timestamps.

---

## 🔑 Default Credentials & Quick Test Access

The database is pre-seeded with realistic data across categories. You can also use the **1-Click Instant Demo Access** buttons directly inside the Sign In modal:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@adspot.com` | `Admin@123456` | Full administrative control via `/admin` |
| **Space Owner** | `owner@adspot.com` | `Owner@123456` | List spaces, review approvals, track inventory |
| **Advertiser** | `advertiser@adspot.com` | `Advertiser@123456` | Book spaces, save favorites, unlock heatmaps |

---

## 🛠️ Setup & Running Locally

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally on port 27017 or a MongoDB Atlas connection string

### 1. Backend Setup
```bash
cd server
npm install
# Create .env from .env.example
npm run seed              # Seeds users, listings, bookings, and enquiries
node server.js            # Runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev               # Runs on http://localhost:5173
```

---

## 🔐 Administrative Console (`/admin` and `/admin/login`)

The Administrative Portal is deliberately hidden from the public navigation bar:
- **Login URL:** `http://localhost:5173/admin/login`
- **Dashboard URL:** `http://localhost:5173/admin`

### Key Admin Capabilities:
- **Overview Dashboard:** Live KPI cards and Recharts visualizations querying MongoDB Atlas.
- **Listing Verification Queue:** Inspect submitted photographs, dimensions, and rates. Approve listings to publish them live, or reject them with mandatory feedback reasons.
- **User Management:** Search accounts and suspend/reactivate users.
- **Managed Ads Strategy Desk:** Assign operators, review creative briefs, and update operational campaign statuses.
- **Customer Support Desk:** Review contact enquiries and add internal resolution notes.
- **Audit Trail:** Immutable record of all administrative status changes.

### CLI Admin Bootstrap Command
To safely create or upgrade an admin account via CLI:
```bash
cd server
node scripts/bootstrapAdmin.js admin@adspot.com Admin@123456 "Adspot Super Admin"
```

---


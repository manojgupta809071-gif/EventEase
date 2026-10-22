# EventEase 🎟️
> **Event & Workshop Registration System** — MERN Stack

A full-stack college project built with **MongoDB**, **Express.js**, **React**, and **Node.js**.

---

## 🚀 Quick Start

### Step 1 — Set up MongoDB Atlas (Free Cloud DB)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and sign up for free
2. Create a new **free M0** cluster
3. Click **Connect** → **Connect your application** → copy the connection string
4. It looks like: `mongodb+srv://yourname:yourpassword@cluster0.xxxxx.mongodb.net/...`

### Step 2 — Configure Backend

```bash
cd backend
copy .env.example .env
```

Open `backend/.env` and paste your MongoDB connection string:
```
PORT=5000
MONGO_URI=mongodb+srv://yourname:yourpassword@cluster0.xxxxx.mongodb.net/eventease?retryWrites=true&w=majority
```

### Step 3 — Install & Run Backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅  Connected to MongoDB
🚀  Server running on http://localhost:5000
```

### Step 4 — Install & Run Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:5173** in your browser 🎉

---

## 📁 Project Structure

```
EventEase/
├── backend/          # Node.js + Express API
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API route handlers
│   ├── middleware/   # Error handling
│   └── server.js     # App entry point
└── frontend/         # React + Vite app
    └── src/
        ├── components/  # Reusable UI components
        ├── pages/       # Route pages
        └── api/         # Axios config
```

## 🌟 Features

- ✅ Beautiful responsive home page with event listings
- ✅ Category filter + search for events
- ✅ Event detail page with seat availability bar
- ✅ Registration form with full validation
- ✅ Duplicate email prevention (MongoDB unique index)
- ✅ Seat limit enforcement
- ✅ Admin dashboard: create, edit, delete events
- ✅ Admin: view attendee list with remove option
- ✅ Success/error messages throughout

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/events | Get all events |
| GET | /api/events/:id | Get single event |
| POST | /api/events | Create event |
| PUT | /api/events/:id | Update event |
| DELETE | /api/events/:id | Delete event + registrations |
| GET | /api/registrations?eventId=X | Get registrations for an event |
| POST | /api/registrations | Register for an event |
| DELETE | /api/registrations/:id | Remove a registration |

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, Vite, Axios
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB Atlas

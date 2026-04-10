# 🛍️ VibeVerse 

> A modern, full-stack e-commerce platform featuring a hyper-local delivery system, real-time guest order tracking, and a comprehensive admin dashboard.

[![Live Demo](https://img.shields.io/badge/Live_Demo-vibeverse.studio-fc199a?style=for-the-badge)](https://vibeverse.studio)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_&_Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 🌐 Live Preview
**Check out the live site:** [vibeverse.studio](https://vibeverse.studio)

<img width="1910" height="919" alt="image" src="https://github.com/user-attachments/assets/d17674ff-98cd-49ed-8867-f6380683d6c0" />


---

## ✨ Key Features

### 🛒 Modern E-Commerce Storefront
- Beautiful, responsive UI built with Tailwind CSS (featuring a signature pink/purple theme).
- Dynamic product catalog, combo offers, and a seamless shopping cart experience.
- Custom checkout flow supporting bKash and Cash on Delivery (COD).

### 📍 Hyper-Local Campus Delivery
- Custom zero-fee **"In DIU Campus Delivery"** integration specifically built for the Daffodil International University community.
- Dynamic delivery fee calculation based on the user's selected region.

### 📦 Guest Order Tracking System
- Customers receive a memorable, auto-generated 8-character Short ID (e.g., `152357A6`).
- Dedicated public tracking portal (`/track`).
- Beautiful visual timeline showing order status (Pending ➔ Processing ➔ Shipped ➔ Delivered).

### 🛡️ Powerful Admin Dashboard
- **Order Management:** View orders, manage statuses, and see full order details in clean, responsive modals.
- **Feedback Loop:** Dedicated customer feedback dashboard with a live `New ↔ Resolved` state synchronization system.
- Secure, role-based access to keep store data safe.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **Database:** PostgreSQL (via [Supabase](https://supabase.com/))
- **Authentication:** Supabase Auth
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started (Local Development)

To get a local copy up and running, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/yourusername/vibeverse.git](https://github.com/yourusername/vibeverse.git)
cd vibeverse

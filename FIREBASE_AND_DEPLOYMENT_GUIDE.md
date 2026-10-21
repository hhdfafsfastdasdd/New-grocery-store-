# Smart Grocery — Deployment & Operational Guide

## 1. Store Overview
- **Name:** Smart Grocery
- **Tagline:** Your Daily Needs, Delivered Fresh
- **Service Areas:** Khordha and Jatani, Odisha, India
- **Currency:** Indian Rupees (₹)
- **Primary Colors:** Primary Green `#15803D`, Dark Green `#166534`, Light Green `#F0FDF4`, Neutral `#F8FAF8`

---

## 2. Secure Admin Access
The store has a separate owner-only administrative dashboard accessible via the **Admin** button in the header/footer or by visiting `/#admin`.

- **Authorized Owner Email:** `bgmia3412@gmail.com`
- **Default Master Passcode:** `smart@2026`
- **Security Policy:** Public user registration is permanently disabled. Only the designated store owner email and credentials can access order management, catalog modifications, and store pricing settings.

---

## 3. WhatsApp Direct Order Integration
Orders are converted into URL-encoded WhatsApp messages directed to the store owner's WhatsApp number without the `+` prefix.

### Format:
```
Hello Smart Grocery!

I want to place a grocery order.

Customer Name: [Customer Name]
Phone: [Phone Number]
Address: [Delivery Address]
Area: [Khordha/Jatani]

Order Items:
1. Basmati Rice - 5 kg - ₹500
2. Mustard Oil - 1 litre - ₹180
3. Sugar - 2 kg - ₹100

Subtotal: ₹780
Delivery Charge: ₹30
Total Amount: ₹810

Please confirm my order.
```

- **Configuring the WhatsApp Number:** In the Admin Control Center -> **Store Settings**, update the **Owner WhatsApp Order Number** (e.g. `919437012345`). It saves persistently and immediately applies to all customer orders.

---

## 4. Custom Grocery Orders
Customers can click **"Request Custom Order"** to order unlisted regional products, special cuts, or specific brands.
- Prompts customer name, phone, delivery address, town, and requested items.
- Opens pre-formatted WhatsApp chat with the owner.
- Simultaneously logs the custom order request in the Admin Dashboard under **Custom Orders** with status tracking (Pending, Contacted, Fulfilled).

---

## 5. Firebase Integration (Firestore & Storage Rules)
If you wish to deploy or link this application with an external Firebase project:

### `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default Deny
    match /{document=**} {
      allow read, write: if false;
    }

    // Function to check if user is the authorized store owner
    function isOwner() {
      return request.auth != null && (
        request.auth.token.email == 'bgmia3412@gmail.com' ||
        exists(/databases/$(database)/documents/admins/$(request.auth.uid))
      );
    }

    // Products & Categories: Publicly readable; Only owner can write
    match /products/{productId} {
      allow read: if true;
      allow write: if isOwner();
    }

    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isOwner();
    }

    // Store Settings: Publicly readable; Only owner can edit
    match /storeSettings/{settingId} {
      allow read: if true;
      allow write: if isOwner();
    }

    // Orders: Anyone can create an order; Only owner can read all or update status
    match /orders/{orderId} {
      allow create: if request.resource.data.subtotal > 0;
      allow read, update, delete: if isOwner();
    }

    // Custom Orders: Anyone can submit; Only owner can manage
    match /customOrders/{customOrderId} {
      allow create: if true;
      allow read, update, delete: if isOwner();
    }
  }
}
```

### `storage.rules`:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /product-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'bgmia3412@gmail.com';
    }
    match /category-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'bgmia3412@gmail.com';
    }
  }
}
```

---

## 6. Feature Testing Checklist
- [x] **Storefront & Branding:** Green & white palette (#15803D, #166534, #F0FDF4), clean typography, logo and Khordha & Jatani service badges.
- [x] **16 Categories:** Full navigation across Vegetables, Fruits, Rice & Grains, Dal, Atta/Flour, Cooking Oil, Spices, Dairy, Snacks, Tea & Coffee, Drinks, Personal Care, Household Cleaning, Baby Care, Frozen, Eggs & Meat.
- [x] **100+ Starter Catalog:** Real products with realistic INR prices, original price strikethroughs, discounts, pack weights, brands, and zero-broken-image fallbacks.
- [x] **Product Search & Filters:** Live search, category chips, sort by Price / Discount / Bestsellers, Price range slider, In-stock toggle, Discount filter.
- [x] **Shopping Basket:** Add to cart, quantity steppers, live subtotal, Khordha vs. Jatani delivery charge, free delivery progress meter, minimum order threshold (₹150).
- [x] **WhatsApp Order Checkout:** Pre-fills customer name, phone, address, town, itemized product list with pack sizes, and opens WhatsApp click-to-chat.
- [x] **Custom Grocery Orders:** Modal form for unlisted items, WhatsApp prefill, and admin log.
- [x] **Owner Admin Dashboard:**
  - Secure login with owner email `bgmia3412@gmail.com` and passcode `smart@2026`.
  - Overview KPI cards (products, active, out-of-stock, orders, sales).
  - Add, edit, delete products with image preview and immediate live site update.
  - Category visibility toggle (e.g. show/hide "Eggs & Meat").
  - Order management with status updates (Pending, Confirmed, Preparing, Out for Delivery, Delivered, Cancelled) and direct WhatsApp customer chat button.
  - Store settings editor (WhatsApp number, delivery fees, free delivery limits, minimum order, hours).
  - JSON catalog backup export and import.

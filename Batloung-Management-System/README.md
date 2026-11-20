
# Batloung Farm Management System

## 1. Project Overview

The Batloung Farm Management System is a web-based application developed to help manage the daily activities of a fruit farming business.

The system provides a central place to manage suppliers, vendors, fruits, stock, purchases, sales and business reports.

It aims to make farm management easier, improve stock tracking and help keep business records organised.

## 2. Project Objectives

The main objectives of this system are to:

- Manage registered suppliers and vendors.
- Register and manage different fruits.
- Monitor available fruit stock.
- Track fruit packaging sizes: Small, Medium and Large.
- Record purchases from suppliers.
- Record sales to vendors.
- Monitor payments and outstanding balances.
- Generate business summaries and reports.

## 3. System Features

### Dashboard
- Displays an overview of the farm.
- Shows total fruits, suppliers and vendors.
- Displays available stock and sales information.

### Supplier Management
- Register new suppliers.
- View supplier information.
- Edit supplier records.
- Delete supplier records.

### Vendor Management
- Register new vendors.
- View vendor information.
- Edit vendor records.
- Delete vendor records.

### Fruit Management
- Register new fruits.
- Add fruit descriptions.
- Set fruit availability status.
- Edit and delete fruit records.

### Stock Management
- Monitor available fruit quantities.
- Display each fruit only once.
- Organise stock according to packaging size:
  - Small
  - Medium
  - Large
- Update stock through recorded purchases and sales.

### Purchase Management
- Select registered suppliers.
- Record purchase dates.
- Select fruits and packaging sizes.
- Enter quantities and unit costs.
- View purchase history.

### Sales Management
- Select registered vendors.
- Record sales dates.
- Select fruits and packaging sizes.
- Enter quantities and selling prices.
- Record payment methods.
- Track amounts paid and outstanding payments.
- View sales history.

### Reports
- View total purchases.
- View total sales.
- View amounts received.
- Monitor current stock.
- View outstanding payments.
- Review business activity summaries.

## 4. Technologies Used

### Frontend
- React.js
- JavaScript
- HTML
- CSS
- Vite

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Communication
- REST API
- Fetch API

## 5. Project Structure

The project is organised into frontend and backend folders.

```text
Batloung-Management-System/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── assets/
│
├── public/
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md

Backend/
├── Server.js
├── package.json
└── other backend files
```

Note: The exact backend folder and file names may differ depending on your project setup.

## 6. Database

The system uses MySQL to store and manage farm information.

The database is named:

`batloung_farm`

The database stores information related to:

- Suppliers
- Vendors
- Fruits
- Stock
- Purchases
- Sales

## 7. Installation and Setup

### Requirements

Before running the project, install:

- Node.js
- MySQL Server
- Visual Studio Code
- A web browser

### Step 1: Open the Frontend Project

Open the project folder in Visual Studio Code.

### Step 2: Install Frontend Dependencies

Open the terminal in the frontend project folder and run:

```bash
npm install
```

### Step 3: Start the Frontend

Run:

```bash
npm run dev
```

Vite will provide a local address, usually:

```text
http://localhost:5173/
```

Open this address in your browser.

### Step 4: Start the Backend

Open another terminal in your backend folder.

Install the backend dependencies:

```bash
npm install
```

Start the backend using the start command configured in its `package.json`.

For example:

```bash
node Server.js
```

### Step 5: Connect to MySQL

Make sure MySQL Server is running and the `batloung_farm` database has been created.

The backend should use the correct MySQL database connection settings.

The frontend communicates with the backend through:

```text
http://localhost:5000/api
```

## 8. Running the System

To use the application, make sure:

1. MySQL Server is running.
2. The backend server is running on port 5000.
3. The React frontend is running on port 5173.
4. The browser is connected to the frontend.

## 9. Future Improvements

Possible future improvements include:

- User authentication and access control.
- Improved report generation.
- Data export to PDF and Excel.
- Better stock notifications.
- Improved system security.

## 10. Project Name

**Batloung Farm Management System**

A system designed to simplify fruit farm business management.

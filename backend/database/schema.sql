
CREATE DATABASE IF NOT EXISTS batloung_farm;

USE batloung_farm;

-- 1. SUPPLIERS
CREATE TABLE IF NOT EXISTS Suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(255)
);

-- 2. FRUITS
CREATE TABLE IF NOT EXISTS Fruits (
    fruit_id INT AUTO_INCREMENT PRIMARY KEY,
    fruit_name VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'Available'
);

-- 3. VENDORS
CREATE TABLE IF NOT EXISTS Vendors (
    vendor_id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(255)
);

-- 4. PURCHASES
CREATE TABLE IF NOT EXISTS Purchases (
    purchase_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    purchase_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (supplier_id)
        REFERENCES Suppliers(supplier_id)
);

-- 5. PURCHASE DETAILS
CREATE TABLE IF NOT EXISTS Purchase_Details (
    purchase_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT NOT NULL,
    fruit_id INT NOT NULL,
    packaging_size ENUM('Small', 'Medium', 'Large') NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (purchase_id)
        REFERENCES Purchases(purchase_id),
    FOREIGN KEY (fruit_id)
        REFERENCES Fruits(fruit_id)
);

-- 6. SALES
CREATE TABLE IF NOT EXISTS Sales (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    sale_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (vendor_id)
        REFERENCES Vendors(vendor_id)
);

-- 7. SALES DETAILS
CREATE TABLE IF NOT EXISTS Sales_Details (
    sale_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    fruit_id INT NOT NULL,
    packaging_size ENUM('Small', 'Medium', 'Large') NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (sale_id)
        REFERENCES Sales(sale_id),
    FOREIGN KEY (fruit_id)
        REFERENCES Fruits(fruit_id)
);

-- 8. STOCK
CREATE TABLE IF NOT EXISTS Stock (
    stock_id INT AUTO_INCREMENT PRIMARY KEY,
    fruit_id INT NOT NULL,
    packaging_size ENUM('Small', 'Medium', 'Large') NOT NULL,
    available_quantity INT NOT NULL DEFAULT 0,
    FOREIGN KEY (fruit_id)
        REFERENCES Fruits(fruit_id),
    UNIQUE (fruit_id, packaging_size)
);

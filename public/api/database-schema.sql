-- Sweet Haven Bakery Database Schema
-- 
-- SETUP INSTRUCTIONS FOR XAMPP:
-- 1. Open phpMyAdmin (http://localhost/phpmyadmin)
-- 2. Create a new database named 'bakery_db'
-- 3. Select the database and go to the SQL tab
-- 4. Copy and paste this entire file and execute
-- 5. The tables will be created with sample data

-- Create database (if running this script directly)
CREATE DATABASE IF NOT EXISTS bakery_db;
USE bakery_db;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

-- Customers table
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url VARCHAR(255),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_available (available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT,
    delivery_method ENUM('pickup', 'delivery') NOT NULL,
    special_notes TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP NULL,
    INDEX idx_status (status),
    INDEX idx_order_date (order_date),
    INDEX idx_customer_email (customer_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10, 2) GENERATED ALWAYS AS (price * quantity) STORED,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url) VALUES
('Chocolate Cake', 'Rich chocolate layers with ganache', 35.99, 'Cakes', '/assets/products/chocolate-cake.jpg'),
('Fresh Croissants', 'Buttery, flaky perfection', 4.99, 'Pastries', '/assets/products/croissants.jpg'),
('Sourdough Bread', 'Artisan sourdough with crispy crust', 7.99, 'Breads', '/assets/products/sourdough.jpg'),
('Chocolate Chip Cookies', 'Classic cookies, dozen', 12.99, 'Cookies', '/assets/products/cookies.jpg'),
('Strawberry Cheesecake', 'Creamy cheesecake with fresh strawberries', 32.99, 'Cakes', '/assets/products/cheesecake.jpg'),
('French Macarons', 'Assorted flavors, box of 12', 18.99, 'Pastries', '/assets/products/macarons.jpg');

-- Insert sample customer data
INSERT INTO customers (name, email, phone, address) VALUES
('John Doe', 'john.doe@example.com', '555-0101', '123 Main St, Sweet Town, ST 12345'),
('Jane Smith', 'jane.smith@example.com', '555-0102', '456 Oak Ave, Sweet Town, ST 12345');

-- Insert sample order
INSERT INTO orders (customer_name, customer_email, customer_phone, delivery_address, 
                   delivery_method, special_notes, total_amount, status) VALUES
('John Doe', 'john.doe@example.com', '555-0101', '123 Main St, Sweet Town, ST 12345',
 'delivery', 'Please ring the doorbell', 48.98, 'completed');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES
(1, 1, 'Chocolate Cake', 35.99, 1),
(1, 4, 'Chocolate Chip Cookies', 12.99, 1);

-- Create view for order summary
CREATE OR REPLACE VIEW order_summary AS
SELECT 
    o.id as order_id,
    o.customer_name,
    o.customer_email,
    o.delivery_method,
    o.total_amount,
    o.status,
    o.order_date,
    COUNT(oi.id) as item_count,
    SUM(oi.quantity) as total_items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- Create stored procedure to get order details
DELIMITER //
CREATE PROCEDURE GetOrderDetails(IN orderId INT)
BEGIN
    SELECT 
        o.*,
        oi.product_name,
        oi.price,
        oi.quantity,
        oi.subtotal
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.id = orderId;
END //
DELIMITER ;

-- Create trigger to update order total
DELIMITER //
CREATE TRIGGER update_order_total AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE orders 
    SET total_amount = (
        SELECT SUM(price * quantity) 
        FROM order_items 
        WHERE order_id = NEW.order_id
    )
    WHERE id = NEW.order_id;
END //
DELIMITER ;

-- Indexes for performance
CREATE INDEX idx_customer_orders ON orders(customer_email, order_date);
CREATE INDEX idx_product_sales ON order_items(product_id, order_id);

-- Display success message
SELECT 'Database schema created successfully!' AS message;

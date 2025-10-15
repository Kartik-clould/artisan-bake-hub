<?php
/**
 * Order Submission API Endpoint
 * 
 * This PHP script handles order submissions from the bakery website.
 * It validates the data, stores it in the database, and sends confirmation emails.
 * 
 * SETUP INSTRUCTIONS (for XAMPP):
 * 1. Place this file in: C:/xampp/htdocs/bakery/api/submit-order.php
 * 2. Create the database using the schema in database-schema.sql
 * 3. Update the database credentials below
 * 4. Install PHPMailer for email functionality (optional but recommended)
 */

// Enable CORS for local development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

require_once 'db_connect.php';

try {
    // Get JSON data from request body
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!$data) {
        throw new Exception('Invalid JSON data');
    }

    // Start transaction
    $conn->beginTransaction();

    // Insert order
    $orderStmt = $conn->prepare("
        INSERT INTO orders (
            customer_name, 
            customer_email, 
            customer_phone, 
            delivery_address, 
            delivery_method,
            special_notes, 
            total_amount,
            status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    ");

    $orderStmt->execute([
        $data['customerName'],
        $data['email'],
        $data['phone'],
        $data['address'],
        $data['deliveryMethod'],
        $data['specialNotes'] ?? '',
        $data['totalAmount']
    ]);

    $orderId = $conn->lastInsertId();

    // Insert order items
    $itemStmt = $conn->prepare("
        INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            price,
            quantity
        ) VALUES (?, ?, ?, ?, ?)
    ");

    foreach ($data['items'] as $item) {
        $itemStmt->execute([
            $orderId,
            $item['id'],
            $item['name'],
            $item['price'],
            $item['quantity']
        ]);
    }

    // Commit transaction
    $conn->commit();

    // Send success response
    echo json_encode([
        'success' => true,
        'message' => 'Order placed successfully',
        'orderId' => $orderId
    ]);

} catch (Exception $e) {
    // Rollback transaction on error
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    // Send error response
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Order failed: ' . $e->getMessage()
    ]);
}

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'bakery_db');

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate input
if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit();
}

// Validate required fields
$requiredFields = ['customer', 'items', 'total'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit();
    }
}

// Validate customer data
$customer = $data['customer'];
$requiredCustomerFields = ['name', 'email', 'phone', 'deliveryMethod'];
foreach ($requiredCustomerFields as $field) {
    if (!isset($customer[$field]) || empty($customer[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required customer field: $field"]);
        exit();
    }
}

// Validate email format
if (!filter_var($customer['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit();
}

// Validate items
if (empty($data['items']) || !is_array($data['items'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Order must contain at least one item']);
    exit();
}

try {
    // Connect to database
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }
    
    // Start transaction
    $conn->begin_transaction();
    
    // Prepare customer data
    $name = $conn->real_escape_string($customer['name']);
    $email = $conn->real_escape_string($customer['email']);
    $phone = $conn->real_escape_string($customer['phone']);
    $address = isset($customer['address']) ? $conn->real_escape_string($customer['address']) : '';
    $deliveryMethod = $conn->real_escape_string($customer['deliveryMethod']);
    $notes = isset($customer['notes']) ? $conn->real_escape_string($customer['notes']) : '';
    $total = floatval($data['total']);
    $orderDate = date('Y-m-d H:i:s');
    
    // Insert order
    $orderSql = "INSERT INTO orders (customer_name, customer_email, customer_phone, 
                 delivery_address, delivery_method, special_notes, total_amount, 
                 order_date, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')";
    
    $stmt = $conn->prepare($orderSql);
    $stmt->bind_param('ssssssds', $name, $email, $phone, $address, 
                      $deliveryMethod, $notes, $total, $orderDate);
    
    if (!$stmt->execute()) {
        throw new Exception('Failed to insert order: ' . $stmt->error);
    }
    
    $orderId = $conn->insert_id;
    
    // Insert order items
    $itemSql = "INSERT INTO order_items (order_id, product_id, product_name, 
                price, quantity) VALUES (?, ?, ?, ?, ?)";
    
    $itemStmt = $conn->prepare($itemSql);
    
    foreach ($data['items'] as $item) {
        $productId = intval($item['id']);
        $productName = $conn->real_escape_string($item['name']);
        $price = floatval($item['price']);
        $quantity = intval($item['quantity']);
        
        $itemStmt->bind_param('iisdi', $orderId, $productId, $productName, 
                              $price, $quantity);
        
        if (!$itemStmt->execute()) {
            throw new Exception('Failed to insert order item: ' . $itemStmt->error);
        }
    }
    
    // Commit transaction
    $conn->commit();
    
    // Send confirmation email (placeholder - implement with PHPMailer)
    sendConfirmationEmail($email, $name, $orderId, $data['items'], $total);
    
    // Send notification to bakery (placeholder)
    sendBakeryNotification($orderId, $customer, $data['items'], $total);
    
    // Close statements and connection
    $stmt->close();
    $itemStmt->close();
    $conn->close();
    
    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'orderId' => $orderId,
        'message' => 'Order placed successfully'
    ]);
    
} catch (Exception $e) {
    // Rollback transaction on error
    if (isset($conn)) {
        $conn->rollback();
        $conn->close();
    }
    
    // Log error (in production, use proper logging)
    error_log('Order submission error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to process order',
        'message' => $e->getMessage()
    ]);
}

/**
 * Send confirmation email to customer
 * In production, use PHPMailer or similar library
 */
function sendConfirmationEmail($email, $name, $orderId, $items, $total) {
    // Placeholder for email functionality
    // Install PHPMailer: composer require phpmailer/phpmailer
    
    $subject = "Order Confirmation #$orderId - Sweet Haven Bakery";
    $message = "Dear $name,\n\n";
    $message .= "Thank you for your order!\n\n";
    $message .= "Order #: $orderId\n";
    $message .= "Total: $" . number_format($total, 2) . "\n\n";
    $message .= "We'll contact you shortly to confirm your order.\n\n";
    $message .= "Best regards,\nSweet Haven Bakery";
    
    // Basic mail function (not recommended for production)
    // mail($email, $subject, $message);
    
    // Log email for development
    error_log("Email would be sent to: $email");
}

/**
 * Send notification email to bakery
 */
function sendBakeryNotification($orderId, $customer, $items, $total) {
    // Placeholder for bakery notification
    $bakeryEmail = 'orders@sweethaven.com';
    
    // Log notification for development
    error_log("Bakery notification: New order #$orderId from {$customer['name']}");
}
?>
// Database connection settings
$host = 'localhost';
$dbname = 'bakery_db';
$username = 'root';
$password = ''; // default XAMPP password is blank

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

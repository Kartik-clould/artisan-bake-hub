<?php
/**
 * Get Orders API Endpoint
 * 
 * This PHP script retrieves all orders from the database for the admin panel.
 */

// Enable CORS for local development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'bakery_db');

try {
    // Connect to database
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }
    
    // Get all orders with their items
    $orderSql = "SELECT 
                    o.id,
                    o.customer_name,
                    o.customer_email,
                    o.customer_phone,
                    o.delivery_address,
                    o.delivery_method,
                    o.special_notes,
                    o.total_amount,
                    o.status,
                    o.order_date
                 FROM orders o
                 ORDER BY o.order_date DESC";
    
    $result = $conn->query($orderSql);
    
    if (!$result) {
        throw new Exception('Failed to fetch orders: ' . $conn->error);
    }
    
    $orders = [];
    
    while ($order = $result->fetch_assoc()) {
        // Get order items for this order
        $itemSql = "SELECT product_name, price, quantity, subtotal 
                   FROM order_items 
                   WHERE order_id = ?";
        
        $stmt = $conn->prepare($itemSql);
        $stmt->bind_param('i', $order['id']);
        $stmt->execute();
        $itemResult = $stmt->get_result();
        
        $items = [];
        while ($item = $itemResult->fetch_assoc()) {
            $items[] = $item;
        }
        
        $order['items'] = $items;
        $orders[] = $order;
        
        $stmt->close();
    }
    
    $conn->close();
    
    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'orders' => $orders
    ]);
    
} catch (Exception $e) {
    if (isset($conn)) {
        $conn->close();
    }
    
    error_log('Get orders error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to fetch orders',
        'message' => $e->getMessage()
    ]);
}
?>

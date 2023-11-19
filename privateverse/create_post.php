<?php
session_start();

// Check if the user is authenticated
if (!isset($_SESSION['user_id'])) {
    header("HTTP/1.1 401 Unauthorized");
    exit();
}

// Ensure the request is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("HTTP/1.1 405 Method Not Allowed");
    exit();
}

// Validate and sanitize input
$user_id = $_SESSION['user_id'];
$content = isset($_POST['postContent']) ? trim($_POST['postContent']) : '';

if (empty($content)) {
    header("HTTP/1.1 400 Bad Request");
    echo "Error: Post content cannot be empty.";
    exit();
}

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user_authentication";

try {
    // Create a new PDO instance (safer and more feature-rich than mysqli)
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare the SQL statement to prevent SQL injection
    $sql = "INSERT INTO posts (user_id, content) VALUES (:user_id, :content)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindParam(':content', $content, PDO::PARAM_STR);
    $stmt->execute();

    echo "success"; // Add quotes for consistency with script.js
} catch (PDOException $e) {
    header("HTTP/1.1 500 Internal Server Error");
    echo "Error: " . $e->getMessage();
    error_log("PDOException in create_post.php: " . $e->getMessage()); // Log the error
} finally {
    $conn = null; // Close the database connection
}
?>

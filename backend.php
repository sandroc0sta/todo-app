<?php
$db = new PDO('sqlite:todos.db');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Ensure table exists
$db->exec("CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    completed INTEGER
)");

$action = $_GET['action'] ?? '';

switch($action) {
    case 'get':
        $stmt = $db->query("SELECT * FROM todos");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'add':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("INSERT INTO todos (text, completed) VALUES (:text, 0)");
        $stmt->execute([':text' => $data['text']]);
        echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
        break;

    case 'toggle':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("UPDATE todos SET completed = NOT completed WHERE id = :id");
        $stmt->execute([':id' => $data['id']]);
        echo json_encode(['success' => true]);
        break;

    case 'delete':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("DELETE FROM todos WHERE id = :id");
        $stmt->execute([':id' => $data['id']]);
        echo json_encode(['success' => true]);
        break;

    case 'delete_completed':
        $stmt = $db->prepare("DELETE FROM todos WHERE completed = 1");
        $stmt->execute();
        echo json_encode(['success' => true]);
        break;

    case 'save':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("UPDATE todos SET text = :text WHERE id = :id");
        $stmt->execute([':text' => $data['text'], ':id' => $data['id']]);
        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}

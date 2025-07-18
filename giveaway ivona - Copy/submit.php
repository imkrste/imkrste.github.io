<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];

    $file = fopen('data.csv', 'r');
    $emailExists = false;

    while (($row = fgetcsv($file)) !== false) {
        if ($row[1] === $email) {
            $emailExists = true;
            break;
        }
    }
    fclose($file);

    if ($emailExists) {
        echo json_encode(['success' => false]);
    } else {
        $file = fopen('data.csv', 'a');
        fputcsv($file, array($name, $email));
        fclose($file);
        echo json_encode(['success' => true]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>

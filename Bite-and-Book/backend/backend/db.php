<?php

$host = '127.0.0.1';
$dbName = 'bite_and_book';
$username = 'root';
$password = ''; // غيّريها محليًا  MySQL  كلمة مرور

$dsn = "mysql:host=$host;dbname=$dbName;charset=utf8mb4";

$pdo = new PDO($dsn, $username, $password, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
]);
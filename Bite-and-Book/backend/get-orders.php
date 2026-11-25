<?php

declare(strict_types=1);

require_once __DIR__ . '/order-api.php';
$userId = orderUser('GET');

try {
    require __DIR__ . '/db.php';
    $statement = $pdo->prepare(
        'SELECT id, meal_type, total_cents, created_at, drink_name, drink_ml, currency, recipe_name
         FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 50'
    );
    $statement->execute([$userId]);
    respond(200, ['orders' => $statement->fetchAll(PDO::FETCH_ASSOC)]);
} catch (Throwable $error) {
    error_log($error->getMessage());
    respond(500, ['error' => 'Orders could not be loaded.']);
}

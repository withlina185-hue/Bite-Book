<?php

declare(strict_types=1);

function respond(int $status, array $data): void
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function orderUser(string $method): int
{
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
        header('Allow: ' . $method);
        respond(405, ['error' => 'Method not allowed.']);
    }

    session_start();
    $userId = filter_var($_SESSION['user_id'] ?? null, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1],
    ]);
    session_write_close();

    if ($userId === false) {
        respond(401, ['error' => 'Please log in to continue.']);
    }
    return $userId;
}

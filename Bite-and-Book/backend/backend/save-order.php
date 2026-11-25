<?php

declare(strict_types=1);

require_once __DIR__ . '/order-api.php';
$userId = orderUser('POST');

$contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
if ($contentType !== 'application/json') {
    respond(415, ['error' => 'Expected a JSON request.']);
}
$body = file_get_contents('php://input', false, null, 0, 8193);
if ($body === false || strlen($body) > 8192) {
    respond(400, ['error' => 'Invalid order data.']);
}
$input = json_decode($body, true);
if (!is_array($input)) {
    respond(400, ['error' => 'Invalid order data.']);
}

$mealType = $input['meal_type'] ?? null;
$items = $input['items'] ?? null;
$prices = [
    'Chicken' => 218,
    'Beef' => 306,
    'Turkey' => 231,
    'Grilled Lamb' => 333,
    'Chicken Shawarma' => 245,
    'Salmon' => 354,
    'Shrimp' => 279,
    'Tuna' => 258,
    'Tofu' => 177,
    'Chickpeas' => 95,
    'Lentils' => 88,
    'Falafel' => 122,
    'Edamame' => 133,
    'Brown Rice' => 102,
    'Quinoa' => 150,
    'Basmati Rice' => 95,
    'Couscous' => 109,
    'Whole Wheat Pasta' => 122,
    'Bulgur' => 92,
    'Pita Bread' => 85,
    'Whole Wheat Wrap' => 105,
    'Sourdough' => 112,
    'Ciabatta' => 116,
    'Mixed Greens' => 88,
    'Baby Spinach' => 99,
    'Romaine' => 82,
    'Arugula' => 102,
    'Broccoli' => 109,
    'Roasted Potatoes' => 116,
    'Cherry Tomatoes' => 95,
    'Cucumber' => 68,
    'Roasted Peppers' => 116,
    'Carrots' => 75,
    'Mushrooms' => 122,
    'Grilled Zucchini' => 105,
    'Sweet Potato' => 119,
    'Feta' => 163,
    'Mozzarella' => 156,
    'Halloumi' => 197,
    'Parmesan' => 184,
    'Boiled Egg' => 116,
    'Avocado' => 197,
    'Black Olives' => 92,
    'Pickled Onions' => 71,
    'Toasted Almonds' => 143,
    'Pumpkin Seeds' => 146,
    'Croutons' => 75,
    'Pickled Cucumbers' => 71,
    'Tahini' => 129,
    'Lemon Dressing' => 95,
    'Garlic Yogurt' => 105,
    'Basil Pesto' => 139,
    'Harissa' => 95,
    'Balsamic Vinaigrette' => 109,
    'Smoky BBQ' => 99,
    'Garlic Sauce' => 119,
    'Hummus' => 109,
    'Baba Ghanoush' => 119,
    'Labneh' => 119,
    'Muhammara' => 146,
    'Vanilla Ice Cream' => 150,
    'Greek Yogurt' => 122,
    'Chocolate Brownie' => 163,
    'Vanilla Cake' => 143,
    'Mini Pancakes' => 136,
    'Strawberries' => 116,
    'Banana' => 85,
    'Blueberries' => 153,
    'Mango' => 133,
    'Granola' => 133,
    'Dark Chocolate Chips' => 177,
    'Crushed Pistachios' => 231,
    'Whipped Cream' => 146,
    'Chocolate Sauce' => 122,
    'Caramel Sauce' => 119,
    'Honey' => 116,
    'Berry Compote' => 136,
];

if (!in_array($mealType, ['Bowl', 'Salad', 'Sandwich', 'Wrap', 'Pasta', 'Grill Plate', 'Mezze Plate', 'Dessert'], true)
    || !is_array($items) || !$items || count($items) > count($prices)) {
    respond(422, ['error' => 'Choose a meal type and at least one ingredient.']);
}

$recipes = [
    'smoky-beef' => ['Bowl', 'Smoky Beef Bowl'],
    'garden' => ['Salad', 'Green Goddess Salad'],
    'halloumi' => ['Sandwich', 'Grilled Halloumi Sandwich'],
    'shawarma' => ['Wrap', 'Chicken Shawarma Wrap'],
    'mushroom' => ['Pasta', 'Creamy Mushroom Pasta'],
    'salmon' => ['Grill Plate', 'Grilled Salmon Plate'],
    'mezze' => ['Mezze Plate', 'Falafel Mezze Plate'],
    'brownie' => ['Dessert', 'Brownie Sundae'],
];
$recipeId = $input['recipe_id'] ?? '';
if (!is_string($recipeId)
    || ($recipeId !== '' && (!isset($recipes[$recipeId]) || $recipes[$recipeId][0] !== $mealType))) {
    respond(422, ['error' => 'Invalid recipe.']);
}
$recipeName = $recipes[$recipeId][1] ?? null;
$dessertIngredients = [
    'Vanilla Ice Cream',
    'Greek Yogurt',
    'Chocolate Brownie',
    'Vanilla Cake',
    'Mini Pancakes',
    'Strawberries',
    'Banana',
    'Blueberries',
    'Mango',
    'Granola',
    'Dark Chocolate Chips',
    'Crushed Pistachios',
    'Whipped Cream',
    'Chocolate Sauce',
    'Caramel Sauce',
    'Honey',
    'Berry Compote',
];
$weights = [];
$weightedPrice = 0;
foreach ($items as $item) {
    $name = is_array($item) ? ($item['name'] ?? null) : null;
    $grams = is_array($item) ? ($item['grams'] ?? null) : null;
    if (!is_string($name) || !isset($prices[$name]) || isset($weights[$name])
        || (($mealType === 'Dessert') !== in_array($name, $dessertIngredients, true))
        || (in_array($mealType, ['Sandwich', 'Wrap'], true)
            && in_array($name, ['Brown Rice', 'Quinoa', 'Basmati Rice', 'Couscous', 'Whole Wheat Pasta', 'Bulgur'], true))
        || ($mealType === 'Pasta' && in_array($name, ['Pita Bread', 'Whole Wheat Wrap', 'Sourdough', 'Ciabatta'], true))
        || !is_int($grams) || $grams < 10 || $grams > 500 || $grams % 10 !== 0) {
        respond(422, ['error' => 'Invalid ingredient or quantity.']);
    }
    $weights[$name] = $grams;
    $weightedPrice += $prices[$name] * $grams;
}
$drinks = [
    'water' => ['Still Water', 330, 80],
    'sparkling' => ['Sparkling Water', 330, 120],
    'orange' => ['Orange Juice', 250, 240],
    'lemon' => ['Lemon & Mint', 250, 260],
];
$drinkId = $input['drink_id'] ?? '';
if (!is_string($drinkId) || ($drinkId !== '' && !isset($drinks[$drinkId]))) {
    respond(422, ['error' => 'Invalid drink selection.']);
}
[$drinkName, $drinkMl, $drinkCents] = $drinks[$drinkId] ?? [null, null, 0];
$totalCents = intdiv($weightedPrice + 50, 100) + $drinkCents;

try {
    require __DIR__ . '/db.php';
    $pdo->beginTransaction();

    $order = $pdo->prepare('INSERT INTO orders (user_id, meal_type, total_cents, drink_name, drink_ml, drink_cents, currency, recipe_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $order->execute([$userId, $mealType, $totalCents, $drinkName, $drinkMl, $drinkCents, 'JOD', $recipeName]);
    $id = (int) $pdo->lastInsertId();

    $detail = $pdo->prepare(
        'INSERT INTO order_items (order_id, ingredient_name, grams, price_per_100g_cents)
         VALUES (?, ?, ?, ?)'
    );
    foreach ($weights as $name => $grams) {
        $detail->execute([$id, $name, $grams, $prices[$name]]);
    }

    $pdo->commit();
    respond(201, ['id' => $id, 'total_cents' => $totalCents]);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log($error->getMessage());
    respond(500, ['error' => 'The order could not be saved.']);
}

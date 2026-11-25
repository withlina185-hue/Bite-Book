CREATE DATABASE IF NOT EXISTS bite_and_book
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE bite_and_book;

CREATE TABLE IF NOT EXISTS orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    meal_type ENUM(
        'Bowl', 'Salad', 'Sandwich', 'Wrap',
        'Pasta', 'Grill Plate', 'Mezze Plate', 'Dessert'
    ) NOT NULL,
    total_cents INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX orders_user_id (user_id, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- oRDER SECTION.
ALTER TABLE orders
    MODIFY COLUMN meal_type ENUM(
        'Bowl', 'Salad', 'Sandwich', 'Wrap',
        'Pasta', 'Grill Plate', 'Mezze Plate', 'Dessert'
    ) NOT NULL,
    ADD COLUMN IF NOT EXISTS drink_name VARCHAR(100) NULL,
    ADD COLUMN IF NOT EXISTS drink_ml SMALLINT UNSIGNED NULL,
    ADD COLUMN IF NOT EXISTS drink_cents INT UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS currency CHAR(3) NOT NULL DEFAULT 'USD',
    ADD COLUMN IF NOT EXISTS recipe_name VARCHAR(100) NULL;

CREATE TABLE IF NOT EXISTS order_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    ingredient_name VARCHAR(100) NOT NULL,
    grams SMALLINT UNSIGNED NOT NULL,
    price_per_100g_cents INT UNSIGNED NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
# 🍽️ Bite & Book – Restaurant Website

## 📌 About the Project

**Bite & Book** is a restaurant website that allows customers to explore the restaurant's menu, customize their own meals, reserve tables, and subscribe to monthly meal plans.

The website aims to provide a simple and user-friendly dining experience while helping the restaurant manage its menu, orders, reservations, and subscriptions through an Admin Dashboard.

## 🎯 Project Objectives

- Provide an easy way for customers to explore the restaurant menu.
- Allow customers to build and customize their own meals.
- Enable online table reservations.
- Offer monthly subscription plans.
- Provide a login system for users.
- Allow administrators to manage restaurant operations.

## ✨ Main Features

### 1. Home Page
- Introduces the restaurant.
- Displays featured meals and services.
- Provides navigation to the main website sections.

### 2. Menu
- Displays available meals and food items.
- Shows meal descriptions and prices.

### 3. Build Your Meal
- Allows customers to customize their meals.
- Provides different ingredient options.
- Calculates the total meal price.
- Displays nutritional information such as calories, protein, carbohydrates, and fats.

### 4. Table Reservation
- Allows customers to reserve a table.
- Collects reservation details such as date, time, and number of guests.

### 5. Monthly Subscription
- Displays available monthly subscription plans.
- Allows customers to choose and subscribe to a suitable plan.

### 6. About Us
- Introduces the restaurant.
- Provides information about its concept and services.

### 7. Login
- Allows registered users to log in.
- Provides access to user accounts.

### 8. Admin Dashboard
- Provides an interface for administrators.
- Manages menu items, orders, reservations, and subscriptions.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Website styling and layout |
| JavaScript | Frontend interactions and dynamic features |
| PHP | Backend development and server-side operations |
| MySQL | Database management |

## 📁 Project Structure

```text
Bite-and-Book/
│
├── frontend/
│   │
│   ├── home.html
│   ├── menu.html
│   ├── build-meal.html  #lina
│   ├── reservation.html
│   ├── subscription.html
│   ├── about.html
│   ├── login.html
│   ├── account.html  #lina
│   │
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css
│   │   │── bite-pages.css  #lina
|   |   └── bite-responsive.css #lina
│   │
│   ├── js/
│   │   ├── main.js
│   │   ├── build-meal.js #lina
    │   │── account.js    #lina
│   │   └── reservation.js
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/
│
├── backend/
│   │
│   ├── db.php
│   ├── login.php
│   ├── register.php
│   ├── save-reservation.php
│   ├── save-subscription.php
│   ├── save-order.php
│   └── admin.php
│
├── database/
│   └── bite_and_book.sql
│
├── README.md
└── .gitignore
```

## 📂 Folder Description

### Frontend
Contains all website pages and client-side files.

- ** HTML files for the eight main website sections.
- **CSS:** Stylesheets for website design and responsive layouts.
- **JS:** JavaScript files for interactive features.
- **Assets:** Images, icons, and fonts used throughout the website.

### Backend
Contains PHP files responsible for server-side operations.

- `db.php`: Establishes the database connection.
- `login.php`: Handles user login.
- `register.php`: Handles user registration.
- `save-reservation.php`: Processes table reservations.
- `save-subscription.php`: Handles monthly subscriptions.
- `save-order.php`: Processes customized meal orders.
- `admin.php`: Handles administrative operations.

### Database
Contains the SQL files used to create and manage the project database.

- `bite_and_book.sql`: Database structure and initial data.

## 🗄️ Database Structure

The project database is planned to include the following main tables:

| Table | Description |
|---|---|
| users | Stores customer and administrator information |
| menu_items | Stores restaurant menu items and prices |
| orders | Stores customer meal orders |
| reservations | Stores table reservation details |
| subscriptions | Stores monthly subscription information |

## ⚙️ Installation & Setup

1. Install [XAMPP](https://www.apachefriends.org/).
2. Clone or download this repository.
3. Move the project folder into the XAMPP `htdocs` directory.
4. Start Apache and MySQL from the XAMPP Control Panel.
5. Open phpMyAdmin.
6. Create the project database and import `database/bite_and_book.sql`.
7. Configure the database connection in `backend/db.php`.
8. Open the website through:

```text
http://localhost/Bite-and-Book/frontend/
```

Make sure the frontend is configured to send its PHP requests to the correct backend paths.

## 👥 Team Collaboration

The project is developed collaboratively using GitHub.

- Each team member is assigned specific pages or features.
- Team members work on separate Git branches.
- Completed work is submitted through Pull Requests.
- Changes are reviewed before being merged into the main branch.

## 🔒 Version Control

The `main` branch contains the approved project code.

All team members should:
- Create a separate branch for their assigned tasks.
- Commit and push their changes.
- Submit a Pull Request for review.
- Avoid pushing directly to the `main` branch.

## 📌 Project Status

**Development in Progress**

This project is being developed as part of a university web development course.

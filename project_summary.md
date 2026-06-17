# Project Summary: MOU Management System

> [!NOTE]
> This document serves as a high-level overview of the `intern_mou2` project to help new developers quickly understand the architecture, technology stack, and codebase structure.

## 1. Project Overview
The application is a web-based system designed to manage and track Memorandums of Understanding (MOUs) and their associated activities. It allows users to add, view, and detail MOUs, track progress statuses (like approval, sign, and legal dates), and log related activities and images.

## 2. Technology Stack
- **Backend Language**: PHP (Legacy compatible, comments reference PHP 5.2.6, utilizing the `mysqli` extension).
- **Database**: MySQL / MariaDB.
- **Frontend**: Standard HTML, CSS, and JavaScript. 
- **Server**: Apache (implied by `c:\AppServ\www\` and `.htaccess` presence) or PHP Built-in Server.

## 3. Architecture & Routing
The application uses a custom Front Controller pattern rather than a modern MVC framework.

- **[index.php](file:///c:/AppServ/www/intern_mou2/index.php)**: Acts as the main router. It parses the request URI, strips the base path (`/intern_mou2`), and maps paths like `/dashboard` or `/mou/add` directly to their corresponding PHP scripts in the `views/` directory.
- **[routing.php](file:///c:/AppServ/www/intern_mou2/routing.php)**: A fallback routing script, likely used for local development with PHP's built-in web server to route requests correctly or serve static files.

## 4. Directory Structure
```text
c:\AppServ\www\intern_mou2\
├── actions/       # Business logic and form processors (e.g., process_mou.php, process_activity.php)
├── assets/        # Static assets (CSS, images, fonts)
├── config/        # Configuration files (db.php for database connection)
├── includes/      # Reusable PHP components (navbar.php, auth.php for session validation)
├── js/            # JavaScript files
└── views/         # Presentation layer files (the UI pages like dashboard.php, mou_list.php)
```

### Key Components:
- **Views**: Files in `views/` handle the UI. They often include `includes/auth.php` at the top to ensure the user is logged in, and then render HTML.
- **Actions**: When a form is submitted in a view, it typically posts to a script in `actions/`. These scripts process the `$_POST` data, interact with the database via `config/db.php`, and then perform a redirect back to a view.

## 5. Database Schema
> [!WARNING]
> The application stores files (PDFs and Images) directly in the database using `BLOB` data types rather than on the filesystem.

The database is defined in **[mou.sql](file:///c:/AppServ/www/intern_mou2/mou.sql)**. Key tables include:

- **`mou_data`**: The core table. Stores MOU metadata (name, institution, contact, status) and various lifecycle dates (approval, submit, accept, sign, etc.). It also stores the actual MOU document in the `mou_pdf` column (`longblob`).
- **`activity_data`**: Stores activities related to an MOU. It links back to the MOU via `mouid`. Contains details like description, date, type, budget, and an `activities_pic` (`mediumblob`).
- **`activity_images`**: A dedicated table for storing multiple images associated with an activity (`activity_id`), with the image data stored in `image_data` (`longblob`).

## 6. Authentication Flow
Authentication is session-based and lightweight.
- **[login.php](file:///c:/AppServ/www/intern_mou2/views/login.php)** handles user login.
- **[auth.php](file:///c:/AppServ/www/intern_mou2/includes/auth.php)** is included at the top of protected views. It checks if `$_SESSION['user_id']` is set. If not, it redirects the user back to the login page using a JavaScript redirect.

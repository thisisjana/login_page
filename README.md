# login_page
# NSCC Signup & User Dashboard

A simple client-side signup and user management application developed as part of the **NSCC Technical Task – 1st Year Track**.

## 📌 Project Overview

This project allows users to register using a username, email address, and password. JavaScript validates the submitted information before creating a user record.

Valid user details are stored in the browser's `localStorage`, allowing the registered data to remain available even after refreshing or reopening the page.

The application also includes a dashboard where all registered users are displayed in a table. Users can be removed from the dashboard using the Delete functionality.

### Core Flow

**Signup → Validation → User Object → localStorage → Dashboard → Delete**

##  Features

* User signup form
* Username validation
* Email format validation
* Password validation
* Clear validation error messages
* Registered user dashboard
* Dynamic user count
* Display of registered users in a table
* Delete user functionality
* Persistent data using `localStorage`
* Responsive design for different screen sizes
* Empty-state handling when no users are registered
* Duplicate email prevention
* Password visibility toggle

##  Technologies Used

* **HTML5** – Page structure and form elements
* **CSS3** – Styling, layout, responsiveness, and user interface
* **JavaScript** – Form validation, DOM manipulation, user management, and event handling
* **localStorage** – Client-side storage of registered user data
* **JSON** – Converting the users array for storage and retrieval

## 🔐 Validation Rules

### Username

* Cannot be empty
* Must meet the minimum length requirement
* Only allowed characters are accepted

### Email

* Cannot be empty
* Must follow a valid email format
* Duplicate email addresses are not allowed

### Password

* Cannot be empty
* Must meet the minimum password length requirement

Validation is handled through separate JavaScript functions such as:

* `validateUsername()`
* `validateEmail()`
* `validatePassword()`

This keeps the validation logic organized and easier to understand.


##  Project Structure


nscc-signup-dashboard/
│
├── index.html
├── style.css
├── script.js
└── README.md


### `index.html`

Contains the structure of the application, including:

* Signup form
* Input fields
* Error-message areas
* Dashboard
* User count
* Registered users table

### `style.css`

Contains:

* Page layout
* Typography
* Form styling
* Button styling
* Error states
* Table styling
* Responsive design

### `script.js`

Contains the application's functionality, including:

* Form submission
* Input validation
* User object creation
* Users array management
* DOM manipulation
* Dashboard rendering
* localStorage operations
* Delete functionality

### `README.md`

Contains project documentation, setup instructions, features, and implementation details.


##  Task Context

This project was developed according to the NSCC Technical Task requirements for the 1st Year Track:

**Signup Form with Validation & Dashboard**

The required functionality includes username, email, and password validation, storing user details in `localStorage`, and displaying registered users in a dashboard table. Delete functionality is included as an additional feature.

---

**Built with HTML, CSS, JavaScript & localStorage.**


# Home Manage API Documentation

This document contains all API endpoints, including details for Headers, Request Bodies, Query Parameters, and response structures. You can copy these details directly to configure your Postman collections.

---

## Global Headers

For all API requests that send or receive JSON, use the following headers:

| Header Name | Value | Description |
| :--- | :--- | :--- |
| `Accept` | `application/json` | Required to receive JSON responses (especially for validation errors) |
| `Content-Type` | `application/json` | Required for all `POST`/`PATCH`/`PUT` requests with JSON bodies |

---

## 1. Authentication Endpoints

### 1.1 Local User Registration
Register a new user with email and password.

* **URL:** `http://localhost:8001/api/auth/register` (or port `8000` depending on direct app/nginx service)
* **Method:** `POST`
* **Headers:**
  ```http
  Accept: application/json
  Content-Type: application/json
  ```
* **Request Body (JSON):**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "password_confirmation": "securepassword123",
    "salary": 2500.00
  }
  ```
  *(Note: `salary` is optional and defaults to `0`)*
* **Success Response (201 Created):**
  ```json
  {
    "access_token": "1|token-string...",
    "token_type": "Bearer",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "salary": "2500.00",
      "created_at": "2026-06-04T18:50:00.000000Z",
      "updated_at": "2026-06-04T18:50:00.000000Z"
    }
  }
  ```

---

### 1.2 Local User Login
Authenticate using email and password to receive an API token.

* **URL:** `http://localhost:8001/api/auth/login`
* **Method:** `POST`
* **Headers:**
  ```http
  Accept: application/json
  Content-Type: application/json
  ```
* **Request Body (JSON):**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "access_token": "2|token-string...",
    "token_type": "Bearer",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "salary": "2500.00",
      "avatar": null,
      "email_verified_at": null,
      "created_at": "2026-06-04T18:50:00.000000Z",
      "updated_at": "2026-06-04T18:50:00.000000Z"
    }
  }
  ```
* **Error Response (401 Unauthorized):**
  ```json
  {
    "error": "Credenciales de inicio de sesión no válidas"
  }
  ```

---

### 1.3 Local User Logout
Revoke the active Sanctum authentication token.

* **URL:** `http://localhost:8001/api/auth/logout`
* **Method:** `POST`
* **Headers:**
  ```http
  Accept: application/json
  Authorization: Bearer <your_access_token>
  ```
* **Success Response (200 OK):**
  ```json
  {
    "message": "Sesión cerrada con éxito"
  }
  ```

---

### 1.4 Redirect to Google (OAuth)
Generate the Google OAuth redirect URL.

* **URL:** `http://localhost:8001/api/auth/google`
* **Method:** `GET`
* **Headers:**
  ```http
  Accept: application/json
  ```
* **Success Response (200 OK):**
  ```json
  {
    "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=..."
  }
  ```

---

### 1.5 Google OAuth Callback
Callback handled by the OAuth service.

* **URL:** `http://localhost:8001/api/auth/google/callback`
* **Method:** `GET`
* **Headers:**
  ```http
  Accept: application/json
  ```
* **Success Response (200 OK):**
  ```json
  {
    "access_token": "3|token-string...",
    "token_type": "Bearer",
    "user": {
      "id": 2,
      "name": "Google User",
      "email": "user@gmail.com",
      "avatar": "https://lh3.googleusercontent.com/...",
      "salary": "0.00",
      "created_at": "2026-06-04T18:50:00.000000Z",
      "updated_at": "2026-06-04T18:50:00.000000Z"
    }
  }
  ```

---

## 2. User Profile Endpoint

### 2.1 Get Authenticated User Details
Get the profile data of the currently logged-in user.

* **URL:** `http://localhost:8001/api/user`
* **Method:** `GET`
* **Headers:**
  ```http
  Accept: application/json
  Authorization: Bearer <your_access_token>
  ```
* **Success Response (200 OK):**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified_at": null,
    "salary": "2500.00",
    "avatar": null,
    "created_at": "2026-06-04T18:50:00.000000Z",
    "updated_at": "2026-06-04T18:50:00.000000Z"
  }
  ```

---

## 3. Saving Goals Endpoints

### 3.1 Get All Saving Goals
Retrieve all saving goals for the authenticated user.

* **URL:** `http://localhost:8001/api/saving-goals`
* **Method:** `GET`
* **Headers:**
  ```http
  Accept: application/json
  Authorization: Bearer <your_access_token>
  ```
* **Success Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "target_name": "New Laptop",
      "target_amount": "1200.00",
      "current_amount": "300.00",
      "deadline": "2026-12-31",
      "created_at": "2026-06-04T18:50:00.000000Z",
      "updated_at": "2026-06-04T18:50:00.000000Z"
    }
  ]
  ```

---

### 3.2 Create Saving Goal
Create a new saving goal for the authenticated user.

* **URL:** `http://localhost:8001/api/saving-goals`
* **Method:** `POST`
* **Headers:**
  ```http
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer <your_access_token>
  ```
* **Request Body (JSON):**
  ```json
  {
    "target_name": "Trip to Japan",
    "target_amount": 3500.00,
    "deadline": "2027-05-15"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "id": 2,
    "user_id": 1,
    "target_name": "Trip to Japan",
    "target_amount": 3500,
    "deadline": "2027-05-15",
    "updated_at": "2026-06-04T18:55:00.000000Z",
    "created_at": "2026-06-04T18:55:00.000000Z"
  }
  ```

---

### 3.3 Update Saving Goal Progress (Increment Amount)
Add savings to a specific goal.

* **URL:** `http://localhost:8001/api/saving-goals/{id}`
* **Method:** `PATCH`
* **Headers:**
  ```http
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer <your_access_token>
  ```
* **Request Body (JSON):**
  ```json
  {
    "amount": 250.00
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "id": 2,
    "user_id": 1,
    "target_name": "Trip to Japan",
    "target_amount": "3500.00",
    "current_amount": "250.00",
    "deadline": "2027-05-15",
    "updated_at": "2026-06-04T18:56:00.000000Z",
    "created_at": "2026-06-04T18:55:00.000000Z"
  }
  ```

---

### 3.4 Delete Saving Goal
Delete a specific saving goal.

* **URL:** `http://localhost:8001/api/saving-goals/{id}`
* **Method:** `DELETE`
* **Headers:**
  ```http
  Accept: application/json
  Authorization: Bearer <your_access_token>
  ```
* **Success Response (200 OK):**
  *(Standard delete response or status 204 depending on client preference)*

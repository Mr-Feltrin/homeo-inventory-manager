# API Documentation

This document provides an overview of the API endpoints available in the Homeo Inventory Management application.

## Table of Contents

-   [Authentication](#authentication)
-   [Dashboard](#dashboard)
-   [Settings](#settings)
-   [Activities](#activities)
-   [Rooms](#rooms)
-   [Containers](#containers)
-   [Items](#items)
-   [Categories](#categories)

## Authentication

### Login

**Endpoint:** `POST /login`

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "password"
}
```

**Response:**

```json
{
    "message": "Login successful",
    "token": "your-authentication-token"
}
```

### Register

**Endpoint:** `POST /register`

**Request Body:**

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password",
    "password_confirmation": "password"
}
```

**Response:**

```json
{
    "message": "Registration successful",
    "token": "your-authentication-token"
}
```

## Dashboard

### Get Total User Storage

**Endpoint:** `GET /api/dashboard/total_user_storage`

**Response:**

```json
{
    "total_rooms": 5,
    "total_containers": 10,
    "total_items": 50,
    "total_categories": 8
}
```

## Settings

### Get Settings

**Endpoint:** `GET /settings`

**Response:**

```json
{
    "settings": {
        "theme": "dark",
        "notifications": true
    }
}
```

## Activities

### Get Activities

**Endpoint:** `GET /api/activities`

**Response:**

```json
[
    {
        "id": 1,
        "action": "created",
        "model_type": "Room",
        "model_id": 1,
        "created_at": "2023-10-01T12:00:00Z"
    }
]
```

## Rooms

### Get All Rooms

**Endpoint:** `GET /api/rooms`

**Response:**

```json
[
    {
        "id": 1,
        "name": "Living Room",
        "description": "Main living area",
        "items_count": 10,
        "containers_count": 2
    }
]
```

### Get Room Containers

**Endpoint:** `GET /api/rooms/{room}/containers`

**Response:**

```json
[
    {
        "id": 1,
        "name": "Bookshelf",
        "description": "Shelf for books"
    }
]
```

### Create Room

**Endpoint:** `POST /api/rooms`

**Request Body:**

```json
{
    "name": "Bedroom",
    "description": "Master bedroom"
}
```

**Response:**

```json
{
    "message": "Room created successfully",
    "room": {
        "id": 2,
        "name": "Bedroom",
        "description": "Master bedroom"
    }
}
```

### Update Room

**Endpoint:** `PATCH /api/rooms/{room}`

**Request Body:**

```json
{
    "name": "Updated Bedroom",
    "description": "Updated description"
}
```

**Response:**

```json
{
    "message": "Room updated successfully",
    "room": {
        "id": 2,
        "name": "Updated Bedroom",
        "description": "Updated description"
    }
}
```

### Delete Room

**Endpoint:** `DELETE /api/rooms/{room}`

**Response:**

```json
{
    "message": "Room deleted successfully"
}
```

## Containers

### Get All Containers

**Endpoint:** `GET /api/containers`

**Response:**

```json
[
    {
        "id": 1,
        "name": "Bookshelf",
        "description": "Shelf for books"
    }
]
```

### Create Container

**Endpoint:** `POST /api/containers`

**Request Body:**

```json
{
    "name": "Cabinet",
    "description": "Storage cabinet"
}
```

**Response:**

```json
{
    "message": "Container created successfully",
    "container": {
        "id": 2,
        "name": "Cabinet",
        "description": "Storage cabinet"
    }
}
```

### Update Container

**Endpoint:** `PATCH /api/containers/{container}`

**Request Body:**

```json
{
    "name": "Updated Cabinet",
    "description": "Updated description"
}
```

**Response:**

```json
{
    "message": "Container updated successfully",
    "container": {
        "id": 2,
        "name": "Updated Cabinet",
        "description": "Updated description"
    }
}
```

### Delete Container

**Endpoint:** `DELETE /api/containers/{container}`

**Response:**

```json
{
    "message": "Container deleted successfully"
}
```

## Items

### Get All Items

**Endpoint:** `GET /api/items`

**Response:**

```json
[
    {
        "id": 1,
        "name": "Laptop",
        "description": "Work laptop",
        "quantity": 1
    }
]
```

### Create Item

**Endpoint:** `POST /api/items`

**Request Body:**

```json
{
    "name": "Tablet",
    "description": "Personal tablet",
    "quantity": 1
}
```

**Response:**

```json
{
    "message": "Item created successfully",
    "item": {
        "id": 2,
        "name": "Tablet",
        "description": "Personal tablet",
        "quantity": 1
    }
}
```

### Update Item

**Endpoint:** `PATCH /api/items/{item}`

**Request Body:**

```json
{
    "name": "Updated Tablet",
    "description": "Updated description",
    "quantity": 2
}
```

**Response:**

```json
{
    "message": "Item updated successfully",
    "item": {
        "id": 2,
        "name": "Updated Tablet",
        "description": "Updated description",
        "quantity": 2
    }
}
```

### Delete Item

**Endpoint:** `DELETE /api/items/{item}`

**Response:**

```json
{
    "message": "Item deleted successfully"
}
```

## Categories

### Get All Categories

**Endpoint:** `GET /api/categories`

**Response:**

```json
[
    {
        "id": 1,
        "name": "Electronics"
    }
]
```

### Create Category

**Endpoint:** `POST /api/categories`

**Request Body:**

```json
{
    "name": "Furniture"
}
```

**Response:**

```json
{
    "message": "Category created successfully",
    "category": {
        "id": 2,
        "name": "Furniture"
    }
}
```

### Update Category

**Endpoint:** `PATCH /api/categories/{category}`

**Request Body:**

```json
{
    "name": "Updated Furniture"
}
```

**Response:**

```json
{
    "message": "Category updated successfully",
    "category": {
        "id": 2,
        "name": "Updated Furniture"
    }
}
```

### Delete Category

**Endpoint:** `DELETE /api/categories/{category}`

**Response:**

```json
{
    "message": "Category deleted successfully"
}
```

For more detailed documentation, please refer to the [main documentation](../README.md).

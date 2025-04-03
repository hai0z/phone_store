# Phone Store API Documentation

This document provides information about the RESTful API endpoints available in the Phone Store backend application.

## Base URL

All API endpoints are accessible at:
```
http://localhost:8080/api/v1
```

## Authentication

Some endpoints require authentication. Authentication is handled using JSON Web Tokens (JWT).

Include the JWT token in the Authorization header for protected routes:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication

#### Customer Registration
- **URL**: `/auth/customer/register`
- **Method**: `POST`
- **Description**: Register a new customer account
- **Request Body**:
  ```json
  {
    "name": "Example User",
    "email": "user@example.com",
    "password": "securepassword",
    "phone": "1234567890"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Registration successful",
    "token": "jwt_token_here"
  }
  ```

#### Customer Login
- **URL**: `/auth/customer/login`
- **Method**: `POST`
- **Description**: Login for customers
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: 
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "Example User",
      "email": "user@example.com"
    }
  }
  ```

#### Admin Login
- **URL**: `/auth/admin/login`
- **Method**: `POST`
- **Description**: Login for admin users
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "adminpassword"
  }
  ```
- **Response**: 
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "admin_id",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "ADMIN"
    }
  }
  ```

#### Password Reset
- **URL**: `/auth/customer/forgot-password`
- **Method**: `POST`
- **Description**: Request a password reset link
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Password reset email sent"
  }
  ```

- **URL**: `/auth/customer/reset-password`
- **Method**: `POST`
- **Description**: Reset password using token
- **Request Body**:
  ```json
  {
    "token": "reset_token_here",
    "password": "new_password"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Password reset successful"
  }
  ```

#### Validate Token
- **URL**: `/auth/validate`
- **Method**: `GET`
- **Description**: Validate JWT token
- **Headers**: `Authorization: Bearer <token>`
- **Response**: 
  ```json
  {
    "valid": true,
    "user": {
      "id": "user_id",
      "name": "Example User",
      "email": "user@example.com"
    }
  }
  ```

### Products

#### Get All Products
- **URL**: `/products`
- **Method**: `GET`
- **Description**: Get a list of all products
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of items per page (default: 10)
  - `sort`: Sort by field (e.g., "price", "name")
  - `order`: Sort order ("asc" or "desc")
- **Response**:
  ```json
  {
    "products": [
      {
        "id": "product_id",
        "name": "iPhone 13",
        "price": 799.99,
        "description": "...",
        "images": ["url1", "url2"]
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
  ```

#### Get Product by ID
- **URL**: `/products/:id`
- **Method**: `GET`
- **Description**: Get details for a specific product
- **Response**:
  ```json
  {
    "id": "product_id",
    "name": "iPhone 13",
    "price": 799.99,
    "description": "...",
    "images": ["url1", "url2"],
    "variants": ["variant_id1", "variant_id2"],
    "brand": "Apple",
    "category": "Smartphone"
  }
  ```

#### Filter Products
- **URL**: `/products/filter`
- **Method**: `GET`
- **Description**: Filter products by various criteria
- **Query Parameters**:
  - `brand`: Brand ID(s)
  - `category`: Category ID(s)
  - `priceMin`: Minimum price
  - `priceMax`: Maximum price
  - `color`: Color ID(s)
  - `storage`: Storage ID(s)
  - `ram`: RAM ID(s)
- **Response**: Same format as Get All Products

#### Get Product Variants
- **URL**: `/products/:id/variants`
- **Method**: `GET`
- **Description**: Get all variants of a specific product
- **Response**:
  ```json
  [
    {
      "id": "variant_id",
      "color": "Blue",
      "storage": "128GB",
      "ram": "8GB",
      "price": 849.99,
      "stock": 10
    }
  ]
  ```

#### Create Product (Admin Only)
- **URL**: `/products`
- **Method**: `POST`
- **Description**: Create a new product
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "name": "iPhone 14",
    "description": "...",
    "brandId": "brand_id",
    "categoryId": "category_id",
    "defaultPrice": 899.99
  }
  ```
- **Response**: Details of created product

#### Update Product (Admin Only)
- **URL**: `/products/:id`
- **Method**: `PUT`
- **Description**: Update an existing product
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**: Product fields to update
- **Response**: Updated product details

#### Delete Product (Admin Only)
- **URL**: `/products/:id`
- **Method**: `DELETE`
- **Description**: Delete a product
- **Headers**: `Authorization: Bearer <admin_token>`
- **Response**: Confirmation message

### Orders

#### Create Order
- **URL**: `/orders`
- **Method**: `POST`
- **Description**: Create a new order
- **Headers**: `Authorization: Bearer <customer_token>`
- **Request Body**:
  ```json
  {
    "items": [
      {
        "productVariantId": "variant_id",
        "quantity": 1
      }
    ],
    "shippingAddress": "123 Main St",
    "paymentMethod": "COD",
    "voucherId": "voucher_id" // Optional
  }
  ```
- **Response**: Order details including total price

#### Get Order by ID
- **URL**: `/orders/:id`
- **Method**: `GET`
- **Description**: Get details for a specific order
- **Headers**: `Authorization: Bearer <token>` (Customer can only view their own orders)
- **Response**: Detailed order information

#### Get All Orders (Admin)
- **URL**: `/orders`
- **Method**: `GET`
- **Description**: Get a list of all orders (Admin only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `status`: Filter by status
- **Response**: List of orders with pagination

#### Update Order Status (Admin)
- **URL**: `/orders/:id/status`
- **Method**: `PATCH`
- **Description**: Update order status
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "status": "SHIPPED"
  }
  ```
- **Response**: Updated order details

#### VNPay Payment
- **URL**: `/orders/:id/payment/vnpay`
- **Method**: `POST`
- **Description**: Generate VNPay payment URL
- **Headers**: `Authorization: Bearer <customer_token>`
- **Response**:
  ```json
  {
    "paymentUrl": "https://vnpay.vn/payment/..."
  }
  ```

### Cart

#### Get Cart
- **URL**: `/cart`
- **Method**: `GET`
- **Description**: Get the current user's cart
- **Headers**: `Authorization: Bearer <customer_token>`
- **Response**: Cart items and total

#### Add to Cart
- **URL**: `/cart`
- **Method**: `POST`
- **Description**: Add item to cart
- **Headers**: `Authorization: Bearer <customer_token>`
- **Request Body**:
  ```json
  {
    "productVariantId": "variant_id",
    "quantity": 1
  }
  ```
- **Response**: Updated cart

### Brands

#### Get All Brands
- **URL**: `/brands`
- **Method**: `GET`
- **Description**: Get a list of all brands
- **Response**: Array of brands

#### Create Brand (Admin)
- **URL**: `/brands`
- **Method**: `POST`
- **Description**: Create a new brand
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "name": "Samsung",
    "logo": "logo_url"
  }
  ```
- **Response**: Created brand details

### Categories

#### Get All Categories
- **URL**: `/categories`
- **Method**: `GET`
- **Description**: Get a list of all categories
- **Response**: Array of categories

#### Create Category (Admin)
- **URL**: `/categories`
- **Method**: `POST`
- **Description**: Create a new category
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "name": "Tablet",
    "description": "Tablet devices"
  }
  ```
- **Response**: Created category details

### Statistics (Admin Only)

#### Get Sales Statistics
- **URL**: `/statistics/sales`
- **Method**: `GET`
- **Description**: Get sales statistics by time period
- **Headers**: `Authorization: Bearer <admin_token>`
- **Query Parameters**:
  - `period`: "day", "week", "month", "year"
- **Response**: Sales data for the requested period

#### Get Product Performance
- **URL**: `/statistics/products`
- **Method**: `GET`
- **Description**: Get statistics about best and worst performing products
- **Headers**: `Authorization: Bearer <admin_token>`
- **Response**: Product performance data

### Ratings

#### Get Product Ratings
- **URL**: `/ratings/product/:productId`
- **Method**: `GET`
- **Description**: Get ratings for a specific product
- **Response**: Array of ratings with customer information

#### Create Rating
- **URL**: `/ratings`
- **Method**: `POST`
- **Description**: Create a new product rating
- **Headers**: `Authorization: Bearer <customer_token>`
- **Request Body**:
  ```json
  {
    "productId": "product_id",
    "rating": 5,
    "comment": "Great product!"
  }
  ```
- **Response**: Created rating details

### Vouchers

#### Get Available Vouchers
- **URL**: `/vouchers/available`
- **Method**: `GET`
- **Description**: Get vouchers available for the current customer
- **Headers**: `Authorization: Bearer <customer_token>`
- **Response**: Array of available vouchers

#### Create Voucher (Admin)
- **URL**: `/vouchers`
- **Method**: `POST`
- **Description**: Create a new voucher
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "code": "SUMMER20",
    "discountType": "PERCENTAGE",
    "discountValue": 20,
    "minOrderValue": 100,
    "maxDiscount": 50,
    "startDate": "2023-06-01T00:00:00Z",
    "endDate": "2023-08-31T23:59:59Z"
  }
  ```
- **Response**: Created voucher details

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": {
    "message": "Error message here",
    "code": "ERROR_CODE",
    "details": {} // Optional additional details
  }
}
```

Common HTTP status codes:
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Not allowed to access resource
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Server-side error 
# Phone Store

A full-stack e-commerce application for selling mobile phones with comprehensive product management, customer accounts, and order processing.

## Project Structure

The project is divided into two main parts:

### Backend

- **Technology**: Node.js with Express, TypeScript, Prisma ORM
- **Features**:
  - RESTful API for products, brands, categories, colors, storage options, and RAM
  - User authentication and authorization (customer and admin roles)
  - Order management and processing
  - Cart functionality
  - File upload capabilities
  - Email notifications
  - Voucher system
  - Ratings and reviews
  - Statistics for admin dashboard

### Frontend

- **Technology**: React 19, TypeScript, Vite, React Router, Zustand
- **UI Library**: Ant Design
- **Features**:
  - Responsive design
  - Product browsing and filtering
  - Shopping cart
  - User account management
  - Order placement and tracking
  - Admin dashboard with statistics
  - Rich text editing with CKEditor and React Quill

## Database Schema

The application uses a relational database with the following key models:
- Products
- Product Variants (combinations of color, storage, RAM)
- Brands
- Categories
- Customers
- Orders
- Ratings
- Vouchers

## Setup Instructions

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the database:
   - Create a `.env` file with your database connection string
   - Run database migrations:
     ```
     npx prisma migrate dev
     ```
   - Seed initial data (optional):
     ```
     npx prisma db seed
     ```

4. Start the server:
   ```
   npm start
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. For production build:
   ```
   npm run build
   ```

## API Endpoints

The backend provides RESTful API endpoints at `/api/v1/` with resources for:
- Products
- Brands
- Categories
- Colors
- Storage options
- RAM options
- Cart
- Orders
- Authentication
- User management
- Statistics

## License

MIT 
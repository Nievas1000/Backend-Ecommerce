# Getting Started

1. Clone the repository: `git clone https://github.com/Nievas1000/Backend-Ecommerce`
2. Move to folder `cd Backend-Ecommerce`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`


## Endpoints

### Brand Endpoints
| Method | Endpoint           | Description                   |
|--------|--------------------|-------------------------------|
| POST   | `/brand`            | Create a new brand             |
| GET    | `/brand`            | Get all brands                 |
| GET    | `/brand/:id`        | Get a specific brand by ID     |
| DELETE | `/brand/:id`        | Delete a brand by ID           |

### Cart Endpoints
| Method | Endpoint              | Description                           |
|--------|-----------------------|---------------------------------------|
| POST   | `/cart`               | Add an item to the cart               |
| POST   | `/cart/user`          | Get the cart by user                  |
| PUT    | `/cart`               | Update item quantity in the cart      |
| DELETE | `/cart`               | Remove an item from the cart          |
| POST   | `/cart/clear`         | Clear the entire cart                 |

### Category Endpoints
| Method | Endpoint            | Description                    |
|--------|---------------------|--------------------------------|
| GET    | `/category`          | Get all categories             |
| POST   | `/category`          | Create a new category          |
| GET    | `/category/:id`      | Get a specific category by ID  |
| DELETE | `/category/:id`      | Delete a category by ID        |

### Inventory Endpoints
| Method | Endpoint                    | Description                         |
|--------|-----------------------------|-------------------------------------|
| POST   | `/inventory`                | Create inventory                    |
| GET    | `/inventory`                | Get all inventory items             |
| GET    | `/inventory/:id`            | Get inventory by product ID         |
| PUT    | `/inventory/:id`            | Update stock for a product          |

### Order Endpoints
| Method | Endpoint               | Description                           |
|--------|------------------------|---------------------------------------|
| POST   | `/order`               | Create a new order                    |
| GET    | `/order`               | Get all orders                        |
| POST   | `/order/user`          | Get orders by user email              |
| GET    | `/order/:id`           | Get a specific order by ID            |
| PUT    | `/order/:id`           | Update an order by ID                 |
| DELETE | `/order/:id`           | Delete an order by ID                 |

### Payment Endpoints
| Method | Endpoint                        | Description                           |
|--------|---------------------------------|---------------------------------------|
| POST   | `/payment`                      | Create a new payment                  |
| GET    | `/payment/:id`                  | Get payments for a specific order     |
| PUT    | `/payment/:id`                  | Update payment details by ID          |
| GET    | `/payment/method`               | Get all payment methods               |
| POST   | `/payment/method`               | Add a new payment method              |
| GET    | `/payment/method/:id`           | Get a specific payment method by ID   |
| PUT    | `/payment/method/:id`           | Update a payment method by ID         |
| DELETE | `/payment/method/:id`           | Delete a payment method by ID         |

### Product Endpoints
| Method | Endpoint                            | Description                                 |
|--------|-------------------------------------|---------------------------------------------|
| GET    | `/product/search`                   | Search for products                         |
| POST   | `/product`                          | Create a new product                        |
| GET    | `/product/:id`                      | Get a specific product by ID                |
| GET    | `/product/category/:id`             | Get products by category ID                 |
| GET    | `/product/brand/:id`                | Get products by brand ID                    |
| PUT    | `/product/:id`                      | Update product details by ID                |
| PUT    | `/product/image/:id`                | Update product image by ID                  |
| DELETE | `/product/:id`                      | Delete a product by ID                      |

### User Endpoints
| Method | Endpoint                   | Description                                 |
|--------|----------------------------|---------------------------------------------|
| POST   | `/user`                    | Register a new user                         |
| GET    | `/user`                    | Get all users                               |
| GET    | `/user/login`              | User login                                  |
| GET    | `/user/auth`               | Check user authentication                   |
| GET    | `/user/logout`             | User logout                                 |
| GET    | `/user/:id`                | Get user details by ID                      |
| DELETE | `/user/:id`                | Delete a user by ID                         |
| PUT    | `/user/change-password`    | Change user password                        |

## Error Handling

All endpoints return appropriate HTTP status codes to indicate success or failure, such as:

- `200 OK`: Successful response
- `201 Created`: Resource successfully created
- `400 Bad Request`: Validation error or invalid input
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error
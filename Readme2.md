### Overview

**User CRUD operations**  
**List management (add/remove items, bulk operations, pagination)**  
**Rate limiting and throttling for security**  
**Caching for optimized performance**  
**Indexed queries for fast database lookups**

## Installation & Setup

npm install

```

### Run the Application
npm run start


### API Documentation (Swagger UI)
Access interactive API docs at:
`http://localhost:3000/api`

---

## Endpoints

###  User API
| **POST**   | `/users` | Create a new user |
| **GET**    | `/users/:id` | Get user details |
| **PUT**    | `/users/:id` | Update user details |
| **DELETE** | `/users/:id` | Delete a user |

### List API
| **POST**   | `/list/:userId` | Add an item to the list |
| **GET**    | `/list/:userId?limit=10&offset=0&contentType=movie` | Get user's list (pagination & filter) |
| **POST**   | `/list/bulk/:userId` | Bulk add items to the list |
| **DELETE** | `/list/:userId/:contentId` | Remove an item from the list |

---

##  Security & Performance Features

### Rate Limiting & Throttling
- Used ThrottlerGuard (`@nestjs/throttler`) to prevent abuse.
- Requests per user are limited to avoid excessive API calls.

###  Caching for Performance
- Caching is enabled using `cache-manager` to reduce database load.
- Frequently requested data is stored in-memory to improve speed.
### Indexed Queries for Faster DB Operations
```

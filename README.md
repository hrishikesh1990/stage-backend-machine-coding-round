# OTT Platform "My List" Feature - Developer Evaluation Project

Welcome to the OTT Platform "My List" feature evaluation project. This project is designed to assess your problem-solving skills, debugging abilities, and overall proficiency in improving an existing codebase. The project is built using [NestJS](https://nestjs.com/), and your task will involve refining the current implementation and adding new features.

## Project Overview

This project simulates a basic OTT (Over-the-Top) platform where users can add content (movies, series, etc.) to their "My List" feature. The backend is implemented with NestJS, and we have already seeded the database with some initial data and models.

Your job will be to address existing issues, optimize the current code, and extend it by adding the required functionalities.

### What I had worked on:
- **Fixed existing bugs** in the project.
- **Improved and optimized** the current implementation.
- **Added new features** to enhance the functionality of the "My List" feature.

## Getting Started

### Prerequisites

Before running the application, ensure you have the following prerequisites installed on your machine:

- Node.js v18 or above
- Docker
- Docker Compose

### Setting Up the Project

1. **Clone the repository** to your local machine:
   ```bash
   git clone <repository-url>


### Getting Started

To start the project locally, use the following command:

```bash
docker-compose up --build
```



### Swagger Documentation for existing apis
Swagger Documentation: http://127.0.0.1:3000/api


### API Endpoints Developed
The application needs to expose the following API endpoints by the completion of this assignment:

- GET /list: Lists all items added to the user's list with pagination.
- POST /list: Adds items to the user's list.
- DELETE /list: Removes an item from the user's list.

### Detailed Funtionality for the API:
- GET /list should include pagination support (e.g., limit and offset).
- POST /list must validate incoming data and ensure no duplicate items are added.
- DELETE /list should ensure proper validation of the item being removed and return meaningful responses.

### Key Deliverables
- My List Management: Users can add, list, and remove items from their "My List" using a MongoDB-based schema where myList stores IDs of movies and TV shows.

### Challenges Faced and Solutions
- Learning NestJS: This project involved working with NestJS for the first time. I focused on understanding how decorators and annotations work within the framework to build a robust API.
- Seeding Mock Data: Setting up the seeder script for mock entries in the database was initially challenging, but it helped me understand the modular dependencies in NestJS.
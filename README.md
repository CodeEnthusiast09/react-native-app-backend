<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Habit Tracker

A habit tracking application built with NestJS. This backend powers a React Native mobile app allows users to create an account, log in, and manage their habits. Users can track completed habits, view daily completions, and manage their habit list.


## 🚀 Features

- Authentication
  - User registration
  - User login with JWT authentication

- Habit Management
  - Create a habit
  - Delete a habit
  - Edit a habit (implemented in the backend, not yet available in the frontend)

- Habit Tracking
  - Mark a habit as completed
  - Get all completed habits
  - Get completed habits for a specific day


## 🛠️ Tech Stack

- Backend: NestJS (Node.js framework)

- Database: PostgreSQL

- Authentication: JWT

- ORM: TypeORM

## 📦 Installation

- Clone the repository:

```bash
$ git clone https://github.com/CodeEnthusiast09/react-native-app-backend.git

$ cd path/to/react-native-app-backend
```

- Install dependencies:

```bash
$ npm install
```

- Set up environment variables (.env file), you'll an example in .env.example

- Run the development server:

```bash
$ npm run start:dev
```

## 📚 API Endpoints


### Auth

- POST /auth/register – Create a new user account

- POST /auth/login – Login and receive a JWT token


### Habits

- POST /habits – Create a new habit

- GET /habits – Get all habits for the authenticated user

- PATCH /habits/:id – Update a habit (backend only)

- DELETE /habits/:id – Delete a habit

### Completed Habits

- POST /habits/:id/completions – Mark a habit as completed

- GET /habits/completed – Get all completed habits

- GET /habits/completed/today – Get completed habits for a day


### 📌 Notes

- The edit habit feature is implemented on the backend, but not yet wired up to the frontend.

- The application is modular and can be extended easily with more features such as streaks, reminders, or habit categories.


## 🧑‍💻 Author

Built with ❤️ using NestJS.

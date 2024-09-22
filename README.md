# Task Management Dashboard

This project is a Task Management Dashboard built with Next.js, Tailwind CSS, and Shadcn UI components. It allows users to create, edit, delete, filter, and sort tasks, while managing them using a Kanban-style board. The project features user authentication using JWT tokens, making sure tasks are associated with specific users, and is integrated with MongoDB for persistent data storage.

## Features

- **User Authentication**: Login, sign-up, and authentication using JWT tokens.
- **Task CRUD Operations**: Create, read, update, and delete tasks.
- **Kanban Board**: Visualize tasks in columns based on their status ('To Do', 'In Progress', 'Completed').
- **Filter & Sort**: Filter tasks by status and sort tasks by priority or due date.


## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Token)
- **State Management**: React Hooks (useState, useEffect)
- **Real-Time Updates**: Axios for HTTP requests
- **Deployment**: Vercel (Frontend), Heroku (Backend)

## Getting Started

### Prerequisites

To run this project, you'll need the following installed on your system:

- Node.js (version 14.x or later)
- MongoDB (you can use MongoDB Atlas or a local instance)
- NPM or Yarn (package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/task-management-dashboard.git
   cd task-management-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. Set up environment variables:

   Create a `.env` file in the backend directory and add your MongoDB connection string, JWT secret, and other required configurations:

   ```
   DATABASE_URL=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   
   ```
   Create a `.env` file in the frontend directory and add your backend API URL:

    BACKEND_URL=your backend deployed url 

    

4. Run the project locally:

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

   Your frontend will be available at `http://localhost:3000`.

5. Backend setup:

   If you are using the provided Express backend, make sure to set up your server repository. Install the necessary dependencies, and provide the MongoDB connection string and JWT secret.
   
   Your backend will be available at `http://localhost:5000`.

## Project Structure

```
/app
  /auth
    /login        # Login page
    /signup       # Signup page
  /dashboard      # Dashboard page where tasks are listed and managed
  /kanbanScreen   # Kanban board page for task visualization

/components
  CreateTaskModal.tsx  # Modal for creating new tasks
  EditTaskModal.tsx    # Modal for editing existing tasks
  FilterSortOptions.tsx  # Component for filtering and sorting tasks

/pages
  /api              # API routes for authentication and task CRUD operations

/styles
  /globals.css      # Global styles

/utils
  /auth             # Authentication helper methods
```

## API Endpoints

- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Login a user.
- `GET /api/tasks`: Retrieve all tasks for the authenticated user.
- `POST /api/tasks`: Create a new task.
- `PUT /api/tasks/:id`: Update an existing task.
- `DELETE /api/tasks/:id`: Delete a task.

## Running the Backend

1. Clone and set up the backend repository.
2. Update the `.env` file in the backend with MongoDB URI and JWT secret.
3. Run the backend server:

   ```bash
   npm start
   ```

## Future Improvements

- Implement dark mode support.
- Add the ability to assign tasks to different users.
- Integrate push notifications for task updates.

## Contact

For any questions or collaboration, please reach out to:

- jadwanihardik10@gmail.com
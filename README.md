# Freelancing ERP System

## Overview
This project is a comprehensive **ERP system** built using the **MERN stack** (MongoDB, Express, React, Node.js) for a **financing firm**. It is designed to help the firm manage projects from freelancing platforms, track income and expenses, calculate employee shares, and generate detailed financial reports such as yearly balance sheets.

## Features

### 1. Project Management
- Manages projects sourced from freelancing websites.
- Allows tracking of project status, milestones, and client information.
- Logs project income and expenses.

### 2. Income and Expense Tracking
- Records both income and expenses for each project.
- Provides an overview of the firm’s financial health on a project and firm-wide basis.

### 3. Employee Share Calculation
- Automatically calculates employee shares based on income and performance metrics.
- Distributes earnings based on predefined roles and contributions.

### 4. Yearly Balance Sheet Generation
- Generates comprehensive yearly balance sheets summarizing income, expenses, employee shares, and overall profits.
- Supports export to PDF/CSV for external review or auditing.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **State Management**: Redux for global state management
- **Styling**: CSS/SCSS and Bootstrap
  
## Installation

### Prerequisites
- Node.js (v14.x or higher)
- MongoDB (local or cloud instance)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/inside-brackets/xs4-management.git
   ```
2. Navigate to the project directory:
   ```bash
   cd xs4-management
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory of the server, with the following:
     ```bash
     AWS_BUCKET_NAME = BUCKET_NAME
     AWS_ACCESS_KEY_ID = ID
     AWS_SECRET_ACCESS_KEY = SECRET_HERE
     MONGO_URI=URI_HERE
     NODE_ENV=dev
     JWT_SECRET=xs4
     PORT=8000
     ```
   - And the client with the following:
     ```bash
     REACT_APP_BACKEND_URL=http://localhost:8000
     ``` 

3. Install dependencies for both the **frontend** and **backend** and start the servers:
   ```bash
   cd server
   npm install
   npm start
   cd ../client
   npm install
   npm start
   ```

6. Access the app at `http://localhost:3000`.

## Contributing
If you would like to contribute to the project, feel free to fork the repository and create a pull request. Contributions are always welcome!

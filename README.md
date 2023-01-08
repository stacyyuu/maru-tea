# LAB - Class 09

## Project: Auth Module Final Project

### Authors: Ethan Luxton, Stacy Yu, Michael Gazaway

### Problem Domain

Your application must employ the following programming concepts:

1. API Auth server must be deployed. A single, backend application is expected
2. Use of your API server to perform database operations
3. Use of login/auth/acl to control access to your resources

### Links and Resources

[ci/cd](https://github.com/stacyyuu/maru-tea/actions/workflows/node.yml) (GitHub Actions)
Main Deployment - Backend: In pull request comments

### Setup

#### .env requirements

-   PORT: 3001
-   DATABASE_URL=postgres://localhost:5432/postgres (Local variable)
-   TOKEN_SECRET=secret

#### How to initialize/run your application

npm start

#### Features / Routes

-   Feature One: POST method to signup and signin as a specific user, Postgresql14 database.
    - POST to /signup to create a new user.
    - POST to /signin to login as a user using basic auth and JWT.
    - Non-authorized routes and authorized routes that Users can only access with proper permissions.
    
-   Feature Two: Apply CRUD methods to Bubble Tea menu items
-   Feature Three: Allow the user to apply CRUD methods to favorite items based off the menu items.
-   Feature Four: Testing
-   Feature Five: Deploy to Dev
-   Feature Six: Deploy to main
-   Feature Seven: Deploy to render.com

#### Tests

-   How do you run tests?
    -   npm test
-   Any tests of note?
    - Return a JSON web token when logging in as a user.
    - Sign up a user as a specific role (admin)
    - Access specific routes as a Admin role user.
    - Apply CRUD methods to Bubble Tea menu items
    - Allow the user to apply CRUD methods to favorite items based off the menu items.

### UML

![UML](https://i.imgur.com/2TlJ5Zn.png)
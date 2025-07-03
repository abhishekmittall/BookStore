import swaggerAutogen from 'swagger-autogen';

process.env.SKIP_AUTH = "true";

const doc = {
    info: {
        title: "Bookstore APIs",
        description: "This is a RESTful API for managing a digital bookstore. It allows users to register, log in, and perform CRUD operations on books they own. Each user's book collection is private and protected via JWT authentication. The API supports endpoints for authentication, book management, and integrates Swagger UI for interactive API documentation.",
        version: '1.0.0',
    },
    host: `localhost:${process.env.PORT || 3000}`,
    schemes: ["http"], // or ["https"] if using SSL
    tags: [
        { name: 'Auth', description: 'Authentication routes including register, login, password recovery' },
        { name: 'Books', description: 'Book management routes (CRUD)' },
        { name: 'Profile', description: 'User profile management' },
        { name: 'Categories', description: 'Book category management routes' }
    ],
    securityDefinitions: {
        bearerAuth: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
            description: "Enter your bearer token in the format **Bearer &lt;token&gt;**",
        },
    },
    definitions: {
        Book: {
            bookName: "The Hobbit",
            descriptions: "Fantasy novel",
            author: "J.R.R. Tolkien",
            language: "English",
            publishDated: "2024-06-01T00:00:00Z",
            userId: "user_id_here"
        },
        User: {
            name: "John Doe",
            email: "john@example.com",
            password: "123456"
        },
        LoginResponse: {
            token: "your_jwt_token"
        }
    }
};

// Include all your route entry files here
const outputFile = './swagger-output.json';
const routes = [
    './index.js',
    './routers/bookRoutes.js',
    './routers/authRoutes.js',
    './routers/profileRoutes.js',
    './routers/categoryRoutes.js'
];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */
swaggerAutogen()(outputFile, routes, doc);
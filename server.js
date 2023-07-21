const express = require ("express");
const morgan = require ("morgan")
const color = require ("colors")
const dotenv = require ("dotenv")
const cors = require ("cors");
const connectDB = require("./configDB/db");
const route = require("./Routes/authRoutes");
const path = require("path");

// Environment Variables file configuration
dotenv.config();

connectDB();

// Creating Object of express
const app = express();

// Using Express, morgan and cors
app.use(express.json());
// Middleware helps in Logging HTTP request details such as the request method, url, response satus and response time and size
app.use(morgan('dev'));
// Cross Origin Access provide karta hain
app.use(cors());

// middleware for joining frontend and backend for deploy
app.use(express.static(path.join(__dirname, './Frontend/build')));


// Creating route for accessing 
app.use('/api/v1/auth',route);

app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, './Frontend/build/index.html'));
})

const Port = process.env.PORT || 6000

app.listen(Port, () => {
      console.log(`Listening on port ${Port}`.bgCyan);
})
const API_VERSION = "v1";

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require(`./${API_VERSION}/utils/db`);

// Import student routes from the versioned folder
const studentRoutes = require(`./${API_VERSION}/routers/studentRoutes`);
const chatbotRoutes = require(`./${API_VERSION}/routers/chatbotRoutes`);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Mount the student routes with the version prefix

// Logging middleware to show detail of each request
app.use((req, res, next) => {
  console.log('--- New Request ---');
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log(`Query Params: ${JSON.stringify(req.query)}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  console.log('-------------------');
  next();
});

app.use(`/api/${API_VERSION}/students`, studentRoutes);
app.use(`/api/${API_VERSION}/chatbot`, chatbotRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Student API backend!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

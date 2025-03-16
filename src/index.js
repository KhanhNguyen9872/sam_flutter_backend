require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routers/userRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the user routes under the "/api" path
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the Express Backend!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

import express from 'express';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/api', routes); // Load the API routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

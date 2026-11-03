import app from './server.js';

if (!process.env.JWT_KEY) throw new Error('JWT_KEY is required');

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}.`);
});

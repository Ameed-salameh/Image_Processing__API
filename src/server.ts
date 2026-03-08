import express from 'express';
import imageRoutes from './routes/images';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', imageRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Image Processing API is running',
    version: '1.0.0',
    endpoints: {
      resizeImage: '/api/images?filename={name}&width={width}&height={height}',
    },
  });
});

app.listen(PORT, (): void => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the API at: http://localhost:${PORT}`);
});

export default app;


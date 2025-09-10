import express from 'express';
import dotenv from 'dotenv';
import { config } from './config/envConfig';
import cors from "cors";
import projectRoutes from './routes/projectRoutes';
import helmet from 'helmet';


dotenv.config();

const app = express();
const PORT = config.port || 5002;
// app.use(helmet()); 
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.get('/health', (_req, res) => {
  res.status(200).send('Service is healthy');
});
app.use("/", projectRoutes);



app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});

import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import employeeRouter from "./routes/employeeRoutes";
import { config } from "./config/envConfig";
dotenv.config();

const app = express();
app.use(express.json());
const PORT = config.port || 5001;
app.use(cors());
// app.use(
//   cors({
//     origin: "*", // Allow requests from any origin
//     methods: ["GET", "POST", "PUT", "DELETE"], // Allow common HTTP methods
//     allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
//   })
// );
// app.use(cors()); // Allows all origins, methods, and headers

app.use("/", employeeRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

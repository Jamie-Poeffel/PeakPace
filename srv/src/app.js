import express from 'express';
import handler from './routes/handler.js';
import db from './config/db.js';
import cors from "cors";
import { config } from 'dotenv';
config()


const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors({
    origin: `${process.env.FRONTEND || "http://localhost:5173"}`,
    methods: ["GET", "POST", "PUT"]
}));

app.use(handler);

app.listen(PORT, () => {
    db.databaseId
    console.log(`Server running at http://localhost:${PORT}`);
});



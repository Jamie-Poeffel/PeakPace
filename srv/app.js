import express from 'express';
import handler from './routes/handler.js';
import db from './config/db.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(handler);

app.listen(PORT, () => {
    db.databaseId
    console.log(`Server running at http://localhost:${PORT}`);
});

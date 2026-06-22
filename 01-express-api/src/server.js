import express from 'express';
import tasksRoutes from "./routes/tasks.routes.js";
import { errorHandler } from "./middlewares/errors.js";
import authRoutes from "./routes/auth.routes.js";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

app.use('/tasks', tasksRoutes)
app.use('/', authRoutes)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`API lancée sur le port ${port}...`);
})
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_PATH = path.join(__dirname, "../json/tasks.json");

export async function getAll() {
    try {
        const data = await fs.readFile(FILE_PATH, "utf8");
        return JSON.parse(data);
    } catch (error) {
        error.status = 404;
        throw error;
    }
}

export async function create(task) {
    const data = await getAll();

    const newTask = {
        id: Date.now(),
        ...task
    };

    data.tasks.push(newTask);

    await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), "utf8");

    console.log(`Created task with id ${task.id}`);

    return newTask;
}

export async function getById(id) {
    const data = await getAll();

    const task = data.tasks.find(t => t.id === Number(id));

    if (!task) {
        const error = new Error("Task introuvable");
        error.status = 404;
        throw error;
    }

    return task;
}
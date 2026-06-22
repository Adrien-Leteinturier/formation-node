
import { create, getAll, getById } from "../services/tasks.service.js";


export async function getTasks(req, res, next) {
    try {
        const tasks = await getAll();

        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
}


export async function getTaskById(req, res, next) {
    try {
        const { id } = req.params;
        const task = await getById(id);

        res.status(200).json(task);

    } catch (error) {
        next(error);
    }
}


export async function createTask(req, res, next) {
    const { title, description } = req.body;

    console.log(`Nouvelle task '${title} ${description}'`);

    try {
        const taskSaved = await create({ title, description });

        res.status(201).json({
            message: "Task créée avec succès",
            data: taskSaved
        });

    } catch (error) {
        next(error)
    }
}
import * as z from "zod";

export function validate(req, res, next) {
    const Task = z.object({
        title: z.string(),
        description: z.string()
    });

    const { title, description } = req.body;
    try {
        Task.parse({ title, description });
        next();
    } catch (error){
        error.status = 400;
        throw error;
    }
}
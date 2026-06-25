import express from 'express';
import { Worker } from 'node:worker_threads';
const app = express();

// Route saine, censée répondre instantanément
app.get('/health', (req, res) => {
    res.json({ status: 'ok', ts: Date.now() });
});

// Route problématique : calcul lourd SYNCHRONE
app.get('/score/:dossier', async (req, res) => {
    const valeur = req.params.dossier;

    const result = await new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js');
        worker.postMessage(valeur);
        worker.on('message', (data) => {
            resolve(data);
        });
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error('Worker stopped with code ' + code));
            }
        });
    });

    res.json({
        dossier: valeur,
        score: result.slice(0, 12)
    });
});

app.listen(3000, () => console.log('Service sur http://localhost:3000'));


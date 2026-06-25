import crypto from "node:crypto";
import { parentPort } from 'worker_threads';

export function compute(valeur) {
    for (let i = 0; i < 5_000_000; i++) {
        valeur = crypto.createHash('sha256').update(valeur).digest('hex');
    }
    return valeur;
}

parentPort.on('message', (valeur) => {
    try {
        const result = compute(valeur);
        parentPort.postMessage(result);
    } catch (err) {
        parentPort.postMessage({ error: err.message });
    }
});

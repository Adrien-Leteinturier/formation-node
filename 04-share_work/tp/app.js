const express = require('express');
const app = express();
const { LRUCache } = require('lru-cache');
const crypto = require('node:crypto');

function cacheLimit (cle){
    const cacheVues = new LRUCache({
        max: 500,                  // 500 entrées maximum
        ttl: 1000 * 60,            // expiration au bout d'une minute
    });

    let entree = cacheVues.get(cle);
    if (!entree) {
        entree = { id: cle, vu: new Date().toISOString(), blob: 'x'.repeat(10_000) };
        cacheVues.set(cle, entree);
    }
    return cacheVues;
}

app.get('/produit/:id', (req, res) => {
    const cle = req.params.id;                 // clé stable, pas de Date/random
    const cacheVues = cacheLimit(cle)
    res.json({ id: cle, entrees: cacheVues.size });
});

app.get('/remise/:montant', (req, res) => {
    const cle = req.params.id;
    let h = req.params.montant;
    const cacheVues = cacheLimit(cle)
    for (let i = 0; i < 2_000_000; i++) {
        h = crypto.createHash('sha256').update(h).digest('hex');
    }
    res.json({ montant: req.params.montant, signature: h.slice(0, 16), pid: process.pid, entrees: cacheVues.size });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
if (require.main === module) {
    app.listen(3000, () => console.log('App sur http://localhost:3000'));
}
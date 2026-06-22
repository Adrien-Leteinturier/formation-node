export function errorHandler(err, req, res) {
    const status = err.status || 500;

    res.status(status).json({
        error: err.message || "Erreur interne du serveur"
    });
}
import { authenticate } from "../services/auth.service.js";

export function login (req, res) {
    const { email, password } = req.body;

    const jwt = authenticate(email, password)

    res.status(200).json({
        jwt: jwt
    })
}
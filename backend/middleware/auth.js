import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        if (!token) {
            return res.status(401).json({ error: 'Token missing or malformed' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ error: 'Token has expired. Please log in again.' });
        } else if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ error: 'Invalid token. Please authenticate.' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

import jwt from 'jsonwebtoken';
const APP_SECRET = process.env.APP_SECRET || 'RIDE_AWESOME_APP_2021';

function getTokenPayload(token: string) {
    return jwt.verify(token, APP_SECRET);
}

function getUserId(req: any, authToken: string) {
    if (req) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            if (!token) {
                throw new Error('Not token found');
            }
            const userId = getTokenPayload(token);
            return userId;
        }
    }
    else if (authToken) {
        const userId = getTokenPayload(authToken);
        return userId;
    }
    throw new Error('Not authenticated');
}

export { APP_SECRET, getUserId };
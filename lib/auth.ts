import { serialize, parse } from 'cookie';
import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE_NAME = 'session_token';
const SESSION_TTL = 24 * 60 * 60; // 1 day in seconds

export const getCookieName = () => COOKIE_NAME;
export const getSessionTtl = () => SESSION_TTL;

export const createSessionToken = async (userId) => {
    const jwt = await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(SESSION_TTL)
        .sign(SECRET);
    return serialize(COOKIE_NAME, jwt, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
};

export const verifySessionToken = async (token) => {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload;
    } catch (err) {
        return null;
    }
};

// Client-side functions
export const getCurrentUser = async (req) => {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies[COOKIE_NAME];
    if (!token) return null;
    return await verifySessionToken(token);
};

export const login = async (req, res, userId) => {
    const token = await createSessionToken(userId);
    res.setHeader('Set-Cookie', token);
    res.status(200).json({ message: 'Logged in' });
};

export const logout = (res) => {
    res.setHeader('Set-Cookie', serialize(COOKIE_NAME, '', { path: '/', httpOnly: true, expires: new Date(0) }));
    res.status(200).json({ message: 'Logged out' });
};

export const signUp = async (userData) => {
    // Handle user registration logic here, e.g. saving to database
};

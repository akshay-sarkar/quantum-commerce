import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IUser } from '../models/User';

const JWT_SECRET =
    process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '5d';

// Generate JWT Token
export const generateToken = (user: IUser): string => {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
            userType: user.userType,
        },
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN,
        },
    );
};

// Verify JWT Token
export const verifyToken = (token: string): any => {
    return jwt.verify(token, JWT_SECRET);
};

// Hash Passsword
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// compare password
export const comparePassword = async (
    candidatePassword: string,
    hashedPassword: string,
): Promise<boolean> => {
    return bcrypt.compare(candidatePassword, hashedPassword);
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';


export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const token  = req.headers["token"];
    const decoded = jwt.verify(token as string, JWT_SECRET)
    
    if(decoded) {
        // @ts-ignore
        req.userId = decoded.id
        next();
    } else {
        res.status(403).json({
            message: "You are not Logged in"
        })
    }
}
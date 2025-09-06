import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../src/utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from '../../src/utils/appError';
import User from "../../src/dB/models/user.model";
import { AuthenticatedRequest, CustomJwtPayload } from "../../src/globalInterfaces/globalInterfaces";

export const isAuthenticated = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("Access token is required", 401)); // 401 مش 404
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as CustomJwtPayload;

    const user = await User.findById(decoded.userId).lean(); 

    if (!user) {
        return next(new AppError("User no longer exists", 401));
    }
  

    req.user = user ;
    next();
});
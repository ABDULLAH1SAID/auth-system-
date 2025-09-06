import { Request, Response, NextFunction } from "express";
import User from "../../dB/models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import AppError from '../../utils/appError';
import Token from "../../dB/models/token.model";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../../globalInterfaces/globalInterfaces";
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        dateOfBirth,
        gender
    } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
         return next(new AppError("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        address,
        dateOfBirth,
        gender
    });

    const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1h" }
    );

    // generate refresh token
    const refreshToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: "7d" }
    );

    await Token.create({
        userId: user._id,
        refreshToken
    });

    // send response
    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender
        },
        accessToken,
        refreshToken,
    });
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError("Invalid email or password", 401));
    }

    if (!user.password) {
        return next(new AppError("Please use Google login for this account", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new AppError("Invalid email or password", 401));
    }

    await Token.findOneAndDelete({ userId: user._id });

    const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1h" }
    );


    const refreshToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: "7d" }
    );

 
    await Token.create({
        userId: user._id,
        refreshToken
    });


    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender
        },
        accessToken,
        refreshToken,
    });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;

    if (!token) {
        return next(new AppError("Refresh token is required", 400));
    }
    // verify the refresh token
    let decoded: any;
    try {
        decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    } catch (error) {
        return next(new AppError("Invalid refresh token", 401));
    }
    // check if the token exists in the database
    const tokenDoc = await Token.findOne({ refreshToken: token });
    if (!tokenDoc) {
        return next(new AppError("Refresh token not found", 404));
    }

    // check if the user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    // generate new access token
    const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1h" }
    );

    res.status(200).json({
        message: "Access token refreshed successfully",
        accessToken,
    });
});

export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction)  => {
    const userId = req.user?._id;

    if (!userId) {
        return next(new AppError("User not authenticated", 401));
    }
    
    await Token.findOneAndDelete({ userId });
    
    res.status(200).json({
        message: "User logged out successfully"
    });
});

export const googleAuthSuccess = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    
    if (!user) {
        return next(new AppError("Google auth failed", 401));
    }

    const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: "7d" }
    );

    await Token.findOneAndDelete({ userId: user._id });
    await Token.create({
        userId: user._id,
        refreshToken
    });

    res.status(200).json({
        status: "success",
        message: "Logged in with Google successfully",
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        },
        accessToken,
        refreshToken,
    });

});

export const googleAuthFailure = (req: Request, res: Response, next: NextFunction) => {
    return next(new AppError("Google auth failed", 401));
};
export const githubAuthSuccess = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    
    if (!user) {
        return res.json("GitHub auth failed");
    }

    const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: "7d" }
    );

    await Token.findOneAndDelete({ userId: user._id });
    await Token.create({
        userId: user._id,
        refreshToken
    });

    res.status(200).json({
        status: "success",
        message: "Logged in with Google successfully",
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        },
        accessToken,
        refreshToken,
    });
});

export const githubAuthFailure = (req: Request, res: Response, next: NextFunction) => {
    return next(new AppError("GitHub auth failed", 401));
};
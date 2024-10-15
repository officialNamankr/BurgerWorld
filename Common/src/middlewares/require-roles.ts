import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { UserType } from "../events/types/userType";
export const requireRoles = (...roles: UserType[]) => (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.currentUser?.role!)) {
        throw new NotAuthorizedError();
    }
    next();
}
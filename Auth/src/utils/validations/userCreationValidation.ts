import { body } from "express-validator";
import { UserType } from "@burger-world.com/common";
export const userCreationValildation = [
    body("name")
    .not()
    .isEmpty()
    .isString()
    .isLength({min: 3, max: 40})
    .trim()
    .withMessage("Name must be between 3 and 40 characters long"),
    body("role")
    .not()
    .isEmpty()
    .isIn(Object.values(UserType))
    .withMessage("Role must be valid"),
    body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Email must be valid"),
    body("password")
    .trim()
    .isLength({min:5})
    .isString()
    .isStrongPassword()
    .withMessage("Password must be at least 5 characters long")
]
import { Router } from "express";
import { body, param } from "express-validator";

import { limiter } from "../config/limiter.js";
import { authenticate } from "../middleware/auth.js";
import { handleInputErrors } from "../middleware/validation.js";
import { AuthController } from "../controllers/AuthController.js";

const router = Router()
router.use(limiter)

router.post('/create-account', 
    body('name').notEmpty().withMessage("El nombre del usuario es requerido."),
    body('password').isLength({min: 8}).withMessage("El password es requerido, mínimo 8 caracteres."),
    body('email').isEmail().withMessage("Email inválido."),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account', 
    body('token').notEmpty().isLength({min: 6, max: 6}).withMessage("Token Inválido."),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email').isEmail().withMessage("Email inválido."),
    body('password').notEmpty().withMessage("El password es requerido."),
    handleInputErrors,
    AuthController.login
)

router.post('/forgot-password', 
    body('email').isEmail().withMessage("Email inválido."),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token').notEmpty().isLength({min: 6, max: 6}).withMessage("Token Inválido."),
    handleInputErrors,
    AuthController.valiteToken
)

router.post('/reset-password/:token', 
    param('token').notEmpty().isLength({min: 6, max: 6}).withMessage("Token Inválido."),
    body('password').isLength({min: 8}).withMessage("El password es requerido, mínimo 8 caracteres."),
    handleInputErrors,
    AuthController.resetPassword
)

router.get('/user', 
    authenticate,
    AuthController.user
)

router.post('/update-password', 
    authenticate,
    body('current_password').notEmpty().withMessage("El password actual es requerido."),
    body('password').isLength({min: 8}).withMessage("El password nuevo es requerido, mínimo 8 caracteres."),
    handleInputErrors,
    AuthController.updatePassword
)

router.post('/check-password', 
    authenticate,
    body('password').notEmpty().withMessage("El password actual es requerido."),
    handleInputErrors,
    AuthController.checkPassword
)

router.put('/user', 
    authenticate,
    body('name').notEmpty().withMessage("El nombre es requerido."),
    body('email').isEmail().withMessage("Email inválido."),
    handleInputErrors,
    AuthController.updateProfile
)

export default router
import { body, param } from "express-validator";
import { Request, Response, NextFunction } from "express";

import Budget from "../models/Budget.js";
import { handleInputErrors } from "./validation.js";
import { handleError } from "../helpers/handleError.js";

declare global {
    namespace Express {
        interface Request {
            budget?: Budget
        }
    }
}

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {
    await param('budgetId')
        .isInt().withMessage("ID Inválido.")
        .custom(value => value > 0).withMessage("ID Inválido.")
        .run(req)

    handleInputErrors(req, res, next)
}

export const validateBudgetExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { budgetId } = req.params
        const budget = await Budget.findByPk(budgetId as string)

        if ( !budget ) {
            const error = new Error("Presupuesto no encontrado.")
            return res.status(404).json({ error: error.message })
        }

        req.budget = budget

        next()
        
    } catch (error) {
        handleError(res, error)
    }
}

export const validateBudgetInput = async (req: Request, res: Response, next: NextFunction) => {

    await body('name').notEmpty().withMessage("El nombre del presupuesto es requerido.").run(req)
    await body('amount')
        .notEmpty().withMessage("La cantidad del presupuesto es requerida.")
        .custom(value => typeof value === 'number').withMessage("La cantidad debe ser un número, no texto.")
        .isFloat({ min: 0.01 }).withMessage("La cantidad debe ser mayor a cero.")
        .run(req)

    handleInputErrors(req, res, next)
}

export const hasAccess = async (req: Request, res: Response, next: NextFunction) => {

    if ( req.budget.userId !== req.user.id ) {
        const error = new Error("Acceso Denegado.")
        return res.status(401).json({ error: error.message })
    }

    next()
}
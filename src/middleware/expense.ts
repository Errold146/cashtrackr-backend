import { body, param } from "express-validator";
import { Request, Response, NextFunction } from "express";

import Expense from "../models/Expense.js";
import { handleInputErrors } from "./validation.js";
import { handleError } from "../helpers/handleError.js";

declare global {
    namespace Express {
        interface Request {
            expense?: Expense
        }
    }
}

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {

    await body('name').notEmpty().withMessage("El nombre del gasto es requerido.").run(req)
    await body('amount')
        .notEmpty().withMessage("La cantidad del gasto es requerida.")
        .custom(value => typeof value === 'number').withMessage("La cantidad debe ser un número, no texto.")
        .isFloat({ min: 0.01 }).withMessage("La cantidad debe ser mayor a cero.")
        .run(req)

    handleInputErrors(req, res, next)
}

export const validateExpenseId = async (req: Request, res: Response, next: NextFunction) => {
    await param('expenseId').isInt().custom(value => value > 0).withMessage("ID inválido").run(req)
    handleInputErrors(req, res, next)
}

export const validateExpenseExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { expenseId } = req.params
        const expense = await Expense.findByPk(expenseId as string)

        if ( !expense ) {
            const error = new Error("Gasto no encontrado.")
            return res.status(404).json({ error: error.message })
        }

        req.expense = expense

        next()
        
    } catch (error) {
        handleError(res, error)
    }
}

export const belongsToBudget = async (req: Request, res: Response, next: NextFunction) => {
    if (req.budget.id !== req.expense.budgetId) {
        const error = new Error("Acceso Denegado.")
        return res.status(403).json({ error: error.message })
    }

    next()
}
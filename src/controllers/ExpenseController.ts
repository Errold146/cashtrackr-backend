import type { Request, Response } from 'express';

import Expense from '../models/Expense.js';
import { handleError } from '../helpers/handleError.js';

export class ExpensesController {
  
    static create = async (req: Request, res: Response) => {
        try {
            // Calcular gasto total actual del presupuesto
            const totalSpent = req.budget.expenses.reduce((total: number, expense: any) => +expense.amount + total, 0)
            const budgetAmount = +req.budget.amount
            const availableFunds = budgetAmount - totalSpent
            const expenseAmount = +req.body.amount

            // Validar si hay fondos disponibles
            if (expenseAmount > availableFunds) {
                return res.status(400).json({
                    error: `No tienes fondos disponibles. Disponible: $${availableFunds.toFixed(2)}`
                })
            }

            const expense = new Expense(req.body)
            expense.budgetId = req.budget.id
            
            await expense.save()
            res.status(201).json("Gasto Creado Correctamente.")

        } catch (error) {
            handleError(res, error)
        }
    }
  
    static getById = async (req: Request, res: Response) => {
        res.json(req.expense)
    }

    static updateById = async (req: Request, res: Response) => {
        try {
            // Calcular gasto total actual sin contar este gasto
            const totalSpent = req.budget.expenses
                .filter((expense: any) => expense.id !== req.expense.id)
                .reduce((total: number, expense: any) => +expense.amount + total, 0)
            
            const budgetAmount = +req.budget.amount
            const availableFunds = budgetAmount - totalSpent
            const expenseAmount = +req.body.amount

            // Validar si hay fondos disponibles para la actualización
            if (expenseAmount > availableFunds) {
                return res.status(400).json({
                    error: `No tienes fondos disponibles. Disponible: $${availableFunds.toFixed(2)}`
                })
            }

            await req.expense.update(req.body)
            res.json("Gasto Actualizado Correctamente.")
        } catch (error) {
            handleError(res, error)
        }
    }
  
    static deleteById = async (req: Request, res: Response) => {
        await req.expense.destroy()
        res.json("Gasto Eliminado Correctamente.")
    }
}
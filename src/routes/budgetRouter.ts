import { Router } from "express";

import { authenticate } from "../middleware/auth.js";
import { BudgetController } from "../controllers/BudgetController.js";
import { ExpensesController } from "../controllers/ExpenseController.js";
import { hasAccess, validateBudgetExists, validateBudgetId, validateBudgetInput } from "../middleware/budget.js";
import { belongsToBudget, validateExpenseExists, validateExpenseId, validateExpenseInput } from "../middleware/expense.js";

const router = Router()

/** Middleware's general's */
router.use(authenticate)
router.param('budgetId', validateBudgetId)
router.param('budgetId', validateBudgetExists)
router.param('budgetId', hasAccess)

router.param('expenseId', validateExpenseId)
router.param('expenseId', validateExpenseExists)
router.param('expenseId', belongsToBudget)

/** Routes for budgets */
router.get('/', BudgetController.getAll)

router.post('/', 
    validateBudgetInput,
    BudgetController.create
)

router.get('/:budgetId', BudgetController.getById)

router.put('/:budgetId', 
    validateBudgetInput,
    BudgetController.updateById
)

router.delete('/:budgetId', BudgetController.delete)

/** Routes for expenses */
router.post('/:budgetId/expenses', 
    validateExpenseInput,
    ExpensesController.create
)

router.get('/:budgetId/expenses/:expenseId', ExpensesController.getById)

router.put('/:budgetId/expenses/:expenseId', 
    validateExpenseInput,
    ExpensesController.updateById
)

router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteById)

export default router
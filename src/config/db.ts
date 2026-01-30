import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";
import User from "../models/User.js";

dotenv.config()

export const db = new Sequelize(process.env.DATABASE_URL, {
    models: [Budget, Expense, User],
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})
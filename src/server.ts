import cors from 'cors';
import colors from 'colors';
import morgan from 'morgan';
import express from 'express';

import { db } from './config/db.js';
import authRouter from './routes/authRouter.js';
import budgetRouter from './routes/budgetRouter.js';

async function connectDB() {
    try {
        await db.authenticate()
        await db.sync()
        console.log(colors.blue.bold('Conectado a la base de datos'))

    } catch (error) {
        console.log(colors.red('Falló la conección de la base de datos'));
        process.exit(1)
    }
}

connectDB()

const app = express()

// CORS Configuration
const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        const whitelist = [process.env.FRONTEND_URL]
        
        if (!origin || whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}

app.use(cors(corsOptions))

app.use(morgan('dev'))

app.use(express.json())

app.use('/api/budgets', budgetRouter)
app.use('/api/auth', authRouter)

export default app
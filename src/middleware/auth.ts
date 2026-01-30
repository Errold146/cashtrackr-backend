import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

import User from "../models/User.js";
import { handleError } from "../helpers/handleError.js";

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bearer = req.headers.authorization
        if ( !bearer ) {
            const error = new Error("Acceso Denegado.")
            return res.status(401).json({ error: error.message })
        }

        const [ , token] = bearer.split(' ')
        if ( !token ) {
            const error = new Error("Token Inválido.")
            return res.status(401).json({ error: error.message })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if ( typeof decoded === "object" && decoded.id ) {
            req.user = await User.findByPk(decoded.id, {
                attributes: [ 'id', 'name', 'email' ]
            })
            next()
        } else {
            const error = new Error("Acceso Denegado.")
            return res.status(401).json({ error: error.message })
        }
        
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            const err = new Error("Acceso Denegado.")
            return res.status(401).json({ error: err.message })
        }
        handleError(res, error)
    }
}
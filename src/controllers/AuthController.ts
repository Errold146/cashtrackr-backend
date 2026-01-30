import type { Request, Response } from "express";

import User from "../models/User.js";
import { generateJWT } from "../helpers/jwt.js";
import { AuthEmail } from "../emails/AuthEmail.js";
import { generateToken } from "../helpers/token.js";
import { handleError } from "../helpers/handleError.js";
import { checkPass, hashPass } from "../helpers/auth.js";

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {

        const { email, password } = req.body

        // Prevenir duplicados
        const userExists = await User.findOne({ where: { email } })
        if ( userExists ) {
            const error = new Error(`El email: ${email} ya esta registrado.`)
            return res.status(409).json({ error: error.message })
        }

        try {
            const user = new User(req.body)
            user.password = await hashPass(password)
            user.token = generateToken()

            await user.save()

            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            })

            res.json("Cuenta Creada Correctamente.")

        } catch (error) {
            handleError(res, error)
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        
        const { token } = req.body
        
        try {
            const user = await User.findOne({ where: { token }})
            if ( !user ) {
                const error = new Error("Token Inválido")
                return res.status(401).json({ error: error.message })
            }
    
            user.confirmed = true
            user.token = null
            await user.save()
           
            res.json("Cuenta Confirmada Correctamente.")

        } catch (error) {
            handleError(res, error)
        }
    }

    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body

        try {
            const user = await User.findOne({ where: { email }})
            if ( !user ) {
                const error = new Error('El usuario no existe.')
                return res.status(404).json({ error: error.message })
            }
            
            if ( !user.confirmed ) {
                const error = new Error('La cuenta no ha sido confirmada.')
                return res.status(403).json({ error: error.message })
            }
            
            const isPasswordCorrect = await checkPass(password, user.password)
            if ( !isPasswordCorrect ) {
                const error = new Error('Password incorrecto.')
                return res.status(401).json({ error: error.message })
            }

            const token = generateJWT(user.id)
    
            res.json(token)

        } catch (error) {
            handleError(res, error)
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body

        try {
            const user = await User.findOne({ where: { email }})
            if ( !user ) {
                const error = new Error("Email no encontrado.")
                return res.status(404).json({ error: error.message })
            }

            user.token = generateToken()
            await user.save()
            await AuthEmail.sendPasswordResetToken({
                name: user.name,
                email: user.email,
                token: user.token
            })

            res.json("Las instrucciones se han enviado a tu email.")

        } catch (error) {
            handleError(res, error)
        }
    }

    static valiteToken = async (req: Request, res: Response) => {
        const { token } = req.body
        
        try {
            const tokenExists = await User.findOne({ where: { token }})
            if ( !tokenExists ) {
                const error = new Error("Token Inválido.")
                return res.status(401).json({ error: error.message })
            }

            res.json("Token válido, asigna un nuevo password.")

        } catch (error) {
            handleError(res, error)
        }
    }

    static resetPassword = async (req: Request, res: Response) => {
        const { token } = req.params
        const { password } = req.body

        try {
            const user = await User.findOne({ where: { token }})
            if ( !user ) {
                const error = new Error("Token Inválido.")
                return res.status(401).json({ error: error.message })
            }

            user.password = await hashPass(password)
            user.token = null
            await user.save()

            res.json("Password modificado correctamente.")

        } catch (error) {
            handleError(res, error)
        }
    }

    static user = async (req: Request, res: Response) => {
        res.json(req.user) 
    }

    static updatePassword = async (req: Request, res: Response) => {

        const { current_password, password } = req.body
        const { id } = req.user

        try {    
            const user = await User.findByPk(id)
            const isPasswordCorrect = await checkPass(current_password, user.password)
            if ( !isPasswordCorrect ) {
                const error = new Error("El password actual es incorrecto.")
                return res.status(401).json({ error: error.message })
            }
    
            user.password = await hashPass(password)
            await user.save()
    
            res.json("Password Actualizado Correctamente.")

        } catch (error) {
            handleError(res, error)
        }
    }

    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body
        const { id } = req.user

        try {    
            const user = await User.findByPk(id)
            const isPasswordCorrect = await checkPass(password, user.password)
            if ( !isPasswordCorrect ) {
                const error = new Error("El password es incorrecto.")
                return res.status(401).json({ error: error.message })
            }
    
            res.json("Password Correcto.")

        } catch (error) {
            handleError(res, error)
        }
    }

    static updateProfile = async (req: Request, res: Response) => {
        const { name, email } = req.body
        const { id } = req.user

        try {
            // Verificar si el email ya está siendo usado por otro usuario
            if (email !== req.user.email) {
                const emailExists = await User.findOne({ where: { email } })
                if (emailExists) {
                    const error = new Error(`El email ${email} ya está siendo utilizado.`)
                    return res.status(409).json({ error: error.message })
                }
            }

            const user = await User.findByPk(id)
            user.name = name
            user.email = email
            await user.save()

            res.json("Perfil actualizado correctamente.")

        } catch (error) {
            handleError(res, error)
        }
    }
}
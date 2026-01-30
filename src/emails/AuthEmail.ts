import { transport } from "../config/nademailer.js"

type EmailType = {
    name: string
    email: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: "CashTrakr <admin@cashtrakr.com>",
            to: user.email,
            subject: "CashTrakr - Confirma tu cuenta.",
            html: `
                <p>Hola: ${user.name}, has creado tu cuenta en CashTrakr, ya esta casi lista.</p>
                <p>Visita el siguiente enlace para confirmar tu cuenta: </p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
                <p>E ingresa el código: <b>${user.token}</b> </p>
            `
        })

        console.log("Email enviado correctamente", email.messageId)
    }
    
    static sendPasswordResetToken = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: "CashTrakr <admin@cashtrakr.com>",
            to: user.email,
            subject: "CashTrakr - Reestablecer contraseña.",
            html: `
                <p>Hola: ${user.name}, has solicitado reestablecer tu password.</p>
                <p>Visita el siguiente enlace para reestablecer tu password: </p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer contraseña</a>
                <p>E ingresa el código: <b>${user.token}</b> </p>
            `
        })

        console.log("Email enviado correctamente", email.messageId)
    }
}
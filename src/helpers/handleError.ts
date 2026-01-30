import { Response } from "express";

export const handleError = (res: Response, error?: unknown) => {
    console.error(error);
    return res.status(500).json({ error: "Lo sentimos, ocurrio un error." })
}
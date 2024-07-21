import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { hash } from "bcryptjs";

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // Verifica se o usuário já existe pelo email
        const isUserEmail = await prisma.user.findUnique({
            where: {
                email,
            }
        });

        if (isUserEmail) {
            return res.status(400).json({
                message: "Usuário já existe.",
            });
        }

        // Hash da senha
        const hashedPassword = await hash(password, 8);

        // Cria o novo usuário
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });

        return res.status(201).json(user);
    } catch (error) {
        console.error(error); 
        return res.status(500).json(error);
    }
};

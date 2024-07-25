import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { hash } from "bcryptjs";
import { sendVerificationEmail } from "../services/EmailService";
import { generateCode } from "../utils/generateCode";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se o usuário já existe pelo email
    const isUserEmail = await prisma.user.findUnique({
      where: {
        email,
      },
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
      },
    });

    const code = generateCode();
    await prisma.authCode.create({
      data: {
        userId: user.id,
        code: code,
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    try {
      await sendVerificationEmail(user.email, user.name, code);
    } catch (emailError) {
      console.error("Erro ao enviar email:", emailError);
      return res.status(400).json({
        message: "Usuário criado, mas erro ao enviar email",
        error: emailError,
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const deleteUsers = async (req: Request, res: Response) => {
  try {
    const deletedCount = await prisma.user.deleteMany();
    console.log(`Usuários deletados: ${deletedCount.count}`);

    return res.status(200).json({
      message: "Todos os usuários foram excluídos",
      deletedCount: deletedCount.count,
    });
  } catch (error) {
    console.error("Erro ao deletar usuários:", error);
    return res.status(500).json({
      message: "Erro interno ao deletar usuários",
      error
    });
  }
}

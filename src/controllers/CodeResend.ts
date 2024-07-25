import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { sendVerificationEmail } from "../services/EmailService";
import { generateCode } from "../utils/generateCode";

export const resendCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Usuário não encontrado",
      });
    }

    const code = generateCode();

    await prisma.authCode.create({
      data: {
        code,
        userId: user.id,
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    try {
      await sendVerificationEmail(user.email, user.name, code);
      return res
        .status(200)
        .json({ message: "Código de verificação reenviado com sucesso" });
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      return res
        .status(500)
        .json({ message: "Erro ao reenviar o código de verificação" });
    }
  } catch (error) {
    console.error("Erro interno:", error);
    return res
      .status(400)
      .json({ message: "Erro ao reenviar o código de verificação" });
  }
};

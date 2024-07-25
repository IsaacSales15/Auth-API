import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const isCodeValid = user.verificationCode === code;
    const isCodeNotExpired =
      user.verificationExpiry && user.verificationExpiry > new Date();

    if (isCodeValid && isCodeNotExpired) {
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          isVerified: true,
          verificationCode: null,
          verificationExpiry: null,
        },
      });

      return res
        .status(200)
        .json({ message: "Usuário verificado com sucesso" });
    } else {
      return res
        .status(400)
        .json({ message: "Código de verificação inválido" });
    }
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);
    return res
      .status(500)
      .json({ message: "Erro interno ao verificar usuário.", error });
  }
};

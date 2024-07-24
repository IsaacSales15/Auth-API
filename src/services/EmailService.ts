import nodemailer from "nodemailer";

// Configuração do transportador de e-mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

// Função para enviar e-mail
export const sendVerificationEmail = async (email: string, name: string, code: string) => {
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: "Bem-vindo! Aqui está seu código de verificação",
    text: `Olá, ${name}! Seu código de verificação é: ${code}`,
  };

  return transporter.sendMail(mailOptions);
};

import { Console } from 'node:console';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export class EmailService {
    public static async sendResetPasswordEmail(to: string, token: string) {
        console.log('Enviando email para:', to);
        const resetLink = `http://localhost:5173/recuperar-senha?token=${token}`;

        await transporter.sendMail({
            from: '"Suporte SIAE',
            to,
            subject: "Recuperação de Senha",
            html: `<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; color: #333333;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                <tr>
                    <td align="center" style="padding: 40px 0;">
                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                            
                            <tr>
                                <td align="center" style="padding: 40px 0 20px 0; background-color: #ffffff;">
                                    <h1 style="margin: 0; color: #021c4c; font-size: 28px; font-weight: bold; letter-spacing: -1px;">Sistema Integrado da Assistência Estudantil</h1>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 0 40px 40px 40px;">
                                    <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #111827; text-align: center;">Recupere sua senha</h2>
                                    <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6; color: #4b5563; text-align: center;">
                                        Olá! Recebemos uma solicitação para redefinir a senha da sua conta. 
                                    </p>
                                    
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center">
                                                <a href=${resetLink} target="_blank" style="display: inline-block; padding: 16px 36px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: #021c4c; text-decoration: none; border-radius: 6px; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);">
                                                    Redefinir Senha
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="margin: 30px 0 0 0; font-size: 14px; line-height: 1.6; color: #9ca3af; text-align: center;">
                                        Este link é válido por <strong>1 hora</strong>. <br>
                                        Por motivos de segurança, nunca compartilhe este link com ninguém.
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                                    <p style="margin: 0; font-size: 12px; color: #6b7280;">
                                        &copy; 2026 Sistema Integrado da Assistência Estudantil. Todos os direitos reservados. <br>
                                        Você recebeu este e-mail porque uma solicitação foi feita em nosso site.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>`
        });
        console.log('Enviou')
    }
}
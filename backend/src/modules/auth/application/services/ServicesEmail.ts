import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export class ServicesEmail {
    async sendMail(to: string, subject: string, text: string, html: string) {
        await transporter.sendMail({
            from: "SaaS Ecommerce <zumbabryan69@gmail.com>",
            to,
            subject,
            text,
            html,
        });
    }

    async sendResetPasswordEmail(email: string, link: string) {
        await this.sendMail(
            email,
            "Restablece tu contraseña - SaaS Ecommerce",
            `Haz click en el siguiente enlace para restablecer tu contraseña: ${link}`,
            `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                    .header { background-color: #059669; padding: 30px 20px; text-align: center; color: #ffffff; }
                    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
                    .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
                    .content h2 { margin-top: 0; font-size: 20px; color: #111827; }
                    .content p { margin-bottom: 24px; font-size: 16px; color: #4B5563; }
                    .button-container { text-align: center; margin: 30px 0; }
                    .button { background-color: #059669; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block; transition: background-color 0.3s; }
                    .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6B7280; border-top: 1px solid #e5e7eb; }
                    .small-text { font-size: 13px; color: #9CA3AF; margin-top: 20px; word-break: break-all; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>SaaS Ecommerce</h1>
                    </div>
                    <div class="content">
                        <h2>Recuperación de Contraseña</h2>
                        <p>Hola,</p>
                        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si no fuiste tú, puedes ignorar este correo de forma segura.</p>
                        <p>Para crear una nueva contraseña, haz clic en el siguiente botón. Este enlace <strong>expirará en 15 minutos</strong>.</p>
                        <div class="button-container">
                            <a href="${link}" class="button" style="color: #ffffff;">Restablecer mi contraseña</a>
                        </div>
                        <p>Si tienes problemas con el botón, copia y pega el siguiente enlace en tu navegador:</p>
                        <p class="small-text"><a href="${link}" style="color: #059669;">${link}</a></p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} SaaS Ecommerce. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            `
        );
    }
}
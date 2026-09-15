import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS, // This must be a 16-character Google App Password
  },
});

export const sendVerificationEmail = async (to: string, code: string) => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn('EMAIL_USER or EMAIL_PASS is not set in .env. Email not sent.');
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Bytevell" <${EMAIL_USER}>`,
      to,
      subject: 'E-posta Doğrulama Kodunuz - Bytevell',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @import url('https://fonts.cdnfonts.com/css/proxima-nova-2');
            body { font-family: 'Proxima Nova', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #0A0A0A; }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0A0A0A;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0A0A0A;">
            <tr>
              <td align="center" style="padding: 60px 20px;">
                
                <!-- Main Container (Borderless, just floating content) -->
                <div style="max-width: 420px; width: 100%; text-align: left;">
                  
                  <!-- Header matches site Auth Header -->
                  <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 10px; letter-spacing: -0.5px;">E-posta Doğrulama</h1>
                    
                    <!-- Indigo Line (Progress bar mimic) -->
                    <div style="height: 3px; width: 100%; background-color: rgba(90,81,214,0.2); border-radius: 4px; margin-top: 15px; position: relative;">
                      <div style="height: 3px; width: 40%; background-color: #5A51D6; border-radius: 4px; margin: 0 auto;"></div>
                    </div>
                  </div>
                  
                  <p style="color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6; margin: 0 0 30px; text-align: center;">
                    Aramıza hoş geldin! Kayıt işlemini tamamlamak için aşağıdaki doğrulama kodunu girebilirsin.
                  </p>
                  
                  <!-- Code Box (Matches site Input style: transparent dark, subtle border) -->
                  <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 30px;">
                    <span style="font-size: 38px; font-weight: 700; letter-spacing: 16px; color: #ffffff; margin-left: 16px;">${code}</span>
                  </div>
                  
                  <p style="color: rgba(255,255,255,0.4); font-size: 13px; line-height: 1.5; margin: 0 0 40px; text-align: center;">
                    Bu kod sadece senin içindir. Eğer bu işlemi sen başlatmadıysan, bu e-postayı dikkate almayabilirsin.
                  </p>
                  
                  <!-- Footer -->
                  <div style="text-align: center;">
                    <p style="color: rgba(255,255,255,0.2); font-size: 12px; margin: 0;">
                      &copy; ${new Date().getFullYear()} Bytevell
                    </p>
                  </div>

                </div>

              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log('Verification email sent via Nodemailer:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending verification email via Nodemailer:', error);
  }
};

import nodemailer from 'nodemailer';

interface VolunteerEmailData {
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface DonationEmailData {
  name: string;
  email: string;
  amount: string;
  programName?: string;
}

interface ContactReplyEmailData {
  name: string;
  email: string;
  subject?: string;
}

interface ContactManualReplyData {
  name: string;
  email: string;
  subject: string;
  originalMessage: string;
  reply: string;
}

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVolunteerStatusEmail(data: VolunteerEmailData) {
    const { name, email, status } = data;

    const subject = this.getEmailSubject(status);
    const html = this.getEmailTemplate(name, status);

    try {
      await this.transporter.sendMail({
        from: `"Sahabat Anak" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html,
      });
      console.log(`Email sent to ${email} for status: ${status}`);
      return { success: true };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }
  }

  private getEmailSubject(status: string): string {
    const subjects = {
      pending: 'Pendaftaran Relawan Anda Sedang Diproses',
      approved: 'Selamat! Pendaftaran Relawan Anda Diterima',
      rejected: 'Informasi Pendaftaran Relawan Anda',
    };
    return subjects[status as keyof typeof subjects] || 'Update Status Relawan';
  }

  private getEmailTemplate(name: string, status: string): string {
    const templates = {
      pending: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Sahabat Anak</h1>
            </div>
            <div class="content">
              <h2>Halo ${name},</h2>
              <p>Terima kasih telah mendaftar sebagai relawan di Sahabat Anak!</p>
              <p>Kami telah menerima pendaftaran Anda dan saat ini sedang dalam proses peninjauan. Tim kami akan segera menghubungi Anda untuk informasi lebih lanjut.</p>
              <p>Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami.</p>
              <p>Salam hangat,<br><strong>Tim Sahabat Anak</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Sahabat Anak. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      approved: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .success-badge { background-color: #10b981; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Selamat!</h1>
            </div>
            <div class="content">
              <h2>Halo ${name},</h2>
              <div class="success-badge">✓ Pendaftaran Diterima</div>
              <p>Kami dengan senang hati menginformasikan bahwa pendaftaran Anda sebagai relawan di <strong>Sahabat Anak</strong> telah <strong>DITERIMA</strong>!</p>
              <p>Langkah selanjutnya:</p>
              <ul>
                <li>Tim kami akan menghubungi Anda dalam 1-2 hari kerja</li>
                <li>Anda akan mendapatkan informasi mengenai orientasi relawan</li>
                <li>Anda akan diberikan akses ke platform relawan kami</li>
              </ul>
              <p>Terima kasih telah bergabung bersama kami untuk membuat perubahan positif bagi anak-anak Indonesia!</p>
              <p>Salam hangat,<br><strong>Tim Sahabat Anak</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Sahabat Anak. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      rejected: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Sahabat Anak</h1>
            </div>
            <div class="content">
              <h2>Halo ${name},</h2>
              <p>Terima kasih telah mendaftar sebagai relawan di Sahabat Anak.</p>
              <p>Setelah meninjau pendaftaran Anda dengan cermat, kami mohon maaf untuk menginformasikan bahwa saat ini kami belum dapat menerima Anda sebagai relawan.</p>
              <p>Hal ini bisa disebabkan oleh berbagai faktor, termasuk keterbatasan kuota atau kecocokan dengan kebutuhan program kami saat ini.</p>
              <p>Namun, kami sangat menghargai minat dan antusiasme Anda untuk membantu. Kami mengundang Anda untuk:</p>
              <ul>
                <li>Mendaftar kembali di periode berikutnya</li>
                <li>Mengikuti update kami di media sosial</li>
                <li>Berpartisipasi dalam program donasi kami</li>
              </ul>
              <p>Terima kasih atas pengertian dan dukungan Anda.</p>
              <p>Salam hangat,<br><strong>Tim Sahabat Anak</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Sahabat Anak. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
    return templates[status as keyof typeof templates] || templates.pending;
  }

  async sendDonationThankYouEmail(data: DonationEmailData) {
    const { name, email, amount, programName } = data;

    try {
      await this.transporter.sendMail({
        from: `"Sahabat Anak" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '❤️ Terima Kasih atas Donasi Anda - Sahabat Anak',
        html: this.getDonationThankYouTemplate(name, amount, programName),
      });
      console.log(`Thank you email sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error('Error sending thank you email:', error);
      return { success: false, error };
    }
  }

  private getDonationThankYouTemplate(name: string, amount: string, programName?: string): string {
    const formattedAmount = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseInt(amount));

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #10b981; color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .donation-box { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .amount { font-size: 28px; font-weight: bold; color: #10b981; margin: 10px 0; }
          .highlight { color: #10b981; font-weight: bold; }
          .quote { font-style: italic; color: #666; padding: 15px; background-color: #f0fdf4; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❤️ Terima Kasih!</h1>
            <p style="margin: 10px 0; font-size: 16px;">Atas Kebaikan Hati Anda</p>
          </div>
          <div class="content">
            <h2>Halo ${name},</h2>
            
            <p>Kami dari <strong class="highlight">Sahabat Anak</strong> mengucapkan terima kasih yang sebesar-besarnya atas donasi Anda yang luar biasa!</p>
            
            <div class="donation-box">
              <p style="margin: 0; color: #666;">Donasi Anda:</p>
              <div class="amount">${formattedAmount}</div>
              ${programName ? `<p style="margin: 10px 0 0 0; color: #666;">Untuk: <strong>${programName}</strong></p>` : '<p style="margin: 10px 0 0 0; color: #666;">Donasi Umum</p>'}
            </div>

            <p>Dengan kontribusi Anda, kami dapat terus memberikan:</p>
            <ul style="color: #555;">
              <li>Pendidikan berkualitas bagi anak-anak yang membutuhkan</li>
              <li>Makanan bergizi untuk tumbuh kembang optimal</li>
              <li>Perlindungan dan dukungan psikososial</li>
              <li>Kesempatan untuk masa depan yang lebih cerah</li>
            </ul>

            <div class="quote">
              "Kebaikan sekecil apapun dapat membuat perbedaan besar dalam kehidupan seorang anak"
            </div>

            <p>Donasi Anda akan digunakan dengan penuh tanggung jawab dan transparansi. Kami akan terus memberikan update mengenai program-program yang didanai oleh donasi Anda.</p>

            <p>Sekali lagi, terima kasih atas kepercayaan dan dukungan Anda. Semoga kebaikan Anda mendapat balasan yang berlipat ganda.</p>

            <p style="margin-top: 30px;">Salam hangat dan penuh rasa syukur,<br><strong>Tim Sahabat Anak</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Sahabat Anak. All rights reserved.</p>
            <p style="margin-top: 10px;">
              <a href="http://localhost:5174" style="color: #10b981; text-decoration: none;">Website</a> | 
              <a href="http://localhost:5174/program" style="color: #10b981; text-decoration: none;">Program Kami</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendContactReplyEmail(data: ContactReplyEmailData) {
    const { name, email, subject } = data;

    try {
      await this.transporter.sendMail({
        from: `"Sahabat Anak" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '✉️ Terima Kasih atas Pesan Anda - Sahabat Anak',
        html: this.getContactReplyTemplate(name, subject),
      });
      console.log(`Contact reply email sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error('Error sending contact reply email:', error);
      return { success: false, error };
    }
  }

  private getContactReplyTemplate(name: string, subject?: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #10b981; color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .message-box { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .highlight { color: #10b981; font-weight: bold; }
          .info-box { background-color: #f0fdf4; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .contact-info { margin-top: 20px; padding: 15px; background-color: white; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Pesan Anda Telah Kami Terima</h1>
          </div>
          <div class="content">
            <h2>Halo ${name},</h2>
            
            <p>Terima kasih telah menghubungi <strong class="highlight">Sahabat Anak</strong>!</p>
            
            <div class="message-box">
              <p style="margin: 0; color: #666; font-size: 14px;">Pesan Anda mengenai:</p>
              <p style="margin: 10px 0 0 0; font-size: 16px; font-weight: bold; color: #333;">${subject || 'Pesan Umum'}</p>
            </div>

            <div class="info-box">
              <p style="margin: 0;"><strong>📬 Status:</strong> Pesan Anda telah berhasil kami terima</p>
              <p style="margin: 10px 0 0 0;"><strong>⏱️ Waktu Respon:</strong> Kami akan merespon dalam 1-2 hari kerja</p>
            </div>

            <p>Tim kami sedang meninjau pesan Anda dan akan segera memberikan respon yang sesuai. Kami sangat menghargai kesabaran Anda.</p>

            <p><strong>Apa yang terjadi selanjutnya?</strong></p>
            <ul style="color: #555;">
              <li>Tim kami akan membaca dan menganalisis pesan Anda dengan teliti</li>
              <li>Kami akan menghubungi Anda melalui email ini dalam waktu 1-2 hari kerja</li>
              <li>Jika diperlukan, kami mungkin akan meminta informasi tambahan</li>
            </ul>

            <div class="contact-info">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">Butuh bantuan lebih cepat?</p>
              <p style="margin: 5px 0; color: #666;">📧 Email: info@sahabatanak.org</p>
              <p style="margin: 5px 0; color: #666;">📱 WhatsApp: +62 812-3456-7890</p>
              <p style="margin: 5px 0; color: #666;">🌐 Website: <a href="http://localhost:5174" style="color: #10b981;">www.sahabatanak.org</a></p>
            </div>

            <p style="margin-top: 30px;">Terima kasih atas kepercayaan Anda kepada Sahabat Anak.</p>

            <p style="margin-top: 20px;">Salam hangat,<br><strong>Tim Sahabat Anak</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Sahabat Anak. All rights reserved.</p>
            <p style="margin-top: 10px;">
              <a href="http://localhost:5174" style="color: #10b981; text-decoration: none;">Website</a> | 
              <a href="http://localhost:5174/program" style="color: #10b981; text-decoration: none;">Program Kami</a> | 
              <a href="http://localhost:5174/contact" style="color: #10b981; text-decoration: none;">Hubungi Kami</a>
            </p>
            <p style="margin-top: 15px; color: #999; font-size: 11px;">
              Email ini dikirim secara otomatis. Harap jangan membalas email ini.<br>
              Untuk pertanyaan lebih lanjut, silakan kirim email ke info@sahabatanak.org
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendContactManualReply(data: ContactManualReplyData) {
    const { name, email, subject, originalMessage, reply } = data;

    try {
      await this.transporter.sendMail({
        from: `"Sahabat Anak" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Re: ${subject}`,
        html: this.getContactManualReplyTemplate(name, subject, originalMessage, reply),
      });
      console.log(`Manual reply email sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error('Error sending manual reply email:', error);
      return { success: false, error };
    }
  }

  private getContactManualReplyTemplate(name: string, subject: string, originalMessage: string, reply: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .original-message { background-color: #e5e7eb; padding: 15px; border-left: 4px solid #6b7280; margin: 20px 0; border-radius: 5px; }
          .reply-box { background-color: white; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .highlight { color: #3b82f6; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 Balasan dari Tim Kami</h1>
            <p style="margin: 0; opacity: 0.9;">Sahabat Anak</p>
          </div>
          <div class="content">
            <h2>Halo ${name},</h2>
            
            <p>Terima kasih telah menghubungi <strong class="highlight">Sahabat Anak</strong>. Berikut adalah balasan atas pesan Anda:</p>
            
            <div class="original-message">
              <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; font-weight: bold;">PESAN ANDA:</p>
              <p style="margin: 0; color: #374151;"><em>"${originalMessage}"</em></p>
            </div>

            <div class="reply-box">
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #3b82f6; font-weight: bold;">BALASAN TIM SAHABAT ANAK:</p>
              <p style="margin: 0; white-space: pre-wrap;">${reply}</p>
            </div>

            <p>Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami kembali.</p>

            <p style="margin-top: 30px;">Salam hangat,<br><strong>Tim Sahabat Anak</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Sahabat Anak. All rights reserved.</p>
            <p style="margin-top: 10px;">
              <a href="http://localhost:5174" style="color: #3b82f6; text-decoration: none;">Website</a> | 
              <a href="http://localhost:5174/contact" style="color: #3b82f6; text-decoration: none;">Hubungi Kami</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();

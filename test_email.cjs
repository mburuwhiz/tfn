const nodemailer = require('nodemailer');

async function test() {
  const account = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });

  try {
    const info = await transporter.sendMail({
      from: '"Test" <test@example.com>',
      to: 'test@example.com',
      subject: 'Hello',
      text: 'World'
    });
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error('Error:', err);
  }
}

test();

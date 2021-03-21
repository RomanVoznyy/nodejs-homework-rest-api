const sgMail = require('@sendgrid/mail');
const Mailgen = require('mailgen');
const emails = require('../config/emails.json');

require('dotenv').config();
console.log(process.env.SENDGRID_API_KEY);

class EmailService {
  constructor(env) {
    this.link =
      env === 'test'
        ? emails.test
        : env === 'production'
        ? emails.prod
        : emails.dev;
  }

  createEmail(verifcationToken, name = 'Guest') {
    const mailGenerator = new Mailgen({
      theme: 'cerberus',
      product: {
        name: 'RV ContactsBook',
        link: this.link,
      },
    });

    const tmpEmail = {
      body: {
        name,
        intro: 'Welcome to ContactsBook',
        action: {
          instructions: 'To get started with ContactsBook, please click here:',
          button: {
            color: '#22BC66',
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${verifcationToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    return mailGenerator.generate(tmpEmail);
  }

  async sendEmail(verifcationToken, email, name) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: 'roman.voznyy.52@gmail.com', // verify email
      subject: 'Welcome to ContactsBook! Confirm Your Email.',
      html: this.createEmail(verifcationToken, name),
    };

    await sgMail.send(msg);
  }
}

module.exports = EmailService;

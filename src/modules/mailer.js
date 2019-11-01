const nodemailer = require('nodemailer');

const hbs = require('nodemailer-express-handlebars');

const path = require('path');

// configura o mailer para enviar email usando o servidor SMTP do .env

const transport = nodemailer.createTransport({
    host: process.env.Ohost,
    port: process.env.port,
    auth: {
        user: process.env.user,
        pass: process.env.pass,
    },
});

const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./src/resources/mail'),
        layoutsDir: path.resolve('./src/resources/mail'),
        defaultLayout: null,
    },
    viewPath: path.resolve('./src/resources/mail'),
    extName: '.html',
};

transport.use('compile', hbs(handlebarOptions));

module.exports = transport;

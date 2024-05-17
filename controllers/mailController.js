const nodemailer = require('nodemailer');

// Configurar el transporte de correo electrónico
const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia 'smtp.example.com' por el host del servidor SMTP que deseas utilizar
    auth: {
        user: 'mili511.1234567@gmail.com',
        pass: 'Energy.08'
    }
});

// Definir la función para enviar el correo electrónico
async function sendEmail(req, res) {
    try {
        // Detalles del correo electrónico
        const mailOptions = {
            from: 'mili511.1234567@gmail.com', // Dirección de correo electrónico del remitente
            to: 'mili511.7777777@gmail.com', // Dirección de correo electrónico del destinatario
            subject: 'Asunto del correo electrónico', // Asunto del correo electrónico
            text: 'Contenido del correo electrónico' // Contenido del correo electrónico en formato de texto sin formato
        };

        // Envío del correo electrónico
        await transporter.sendMail(mailOptions);

        console.log('Correo electrónico enviado con éxito');
        res.status(200).send('Correo electrónico enviado con éxito');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        res.status(500).json({ message: 'Error al enviar el correo electrónico' });
    }
}

// Exportar la función para enviar el correo electrónico
module.exports = { sendEmail };

const nodemailer = require('nodemailer');

export function registroMail(datos){
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: USER_MAIL,
            pass: USER_MAIL_PASS
        }
    });
    
    const mailOptions = {
        from: 'Alta de Usuarios',
        to: datos.email,
        subject: 'Registro de nuevo usuario',
        html: `<h1 style="color: blue;">Alta de nuevo usuario</h1>
        <p>Se ha registrado un nuevo usuario con los siguientes datos:</p>
        <ul>
            <li>Email: ${datos.email}</li>
            <li>Direccion: ${datos.direction}</li>
            <li>Edad: ${datos.age}</li>
            <li>Telefono: ${datos.phone}</li>
            <li>Foto: ${datos.photo}</li>
        </ul>`,
    }
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(info);
    } catch (error) {
        console.log(err)
    }
}

export function compraMail(datos){
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: USER_MAIL,
            pass: USER_MAIL_PASS
        }
    });
    
    const mailOptions = {
        from: 'Compra de Productos',
        to: 'kdcbc2oggderj27r@ethereal.email',
        subject: 'Se ha realizado una nueva compra',
        html: `<h1 style="color: blue;">Nueva Compra</h1>
        <p>Hemos registrado la compra de los siguientes productos:</p>
        <ul>
            <li>Nombre: ${datos.nombre}</li>
            <li>Precio: ${datos.precio}</li>
        </ul>`,
    }
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(info);
    } catch (error) {
        console.log(err)
    }
}


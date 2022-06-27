const twilio = require('twilio');

export function envioSMS(){
    const accountSid = ACCOUNT_SID;
    const authToken = AUTH_TOKEN;

    const client = twilio(accountSid, authToken);

    try {
        const message = await client.messages.create({
            body: 'Su pedido ha sido recibido con exito y ya lo estamos procesando.',
            from: '+19785612935',
            to: '+5491123917315'
        })
        console.log(message);
    } catch (error) {
        console.log(error)
    }
}
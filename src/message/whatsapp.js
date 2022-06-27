const twilio = require('twilio');

export function envioWhatsapp(){
    const accountSid = ACCOUNT_SID;
    const authToken = AUTH_TOKEN;

    const client = twilio(accountSid, authToken);

    const options = {
        body: 'Se ha realizado la compra de nuevos productos.',
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+5491123917315'
    }

    try {
        const message = await client.messages.create(options)
        console.log(message);
    } catch (error) {
        console.log(error)
    }
}
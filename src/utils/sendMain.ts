import { createTransport } from "nodemailer";
require('dotenv').config();
console.log("Email and password", process.env.EMAIL, process.env.PASS);

const transport = createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });
  

export const sendMail = async (emails: string[], trackingId: string) => {
    try{
        const TrackingUrl = `http://localhost:3000/track/track-mail/${trackingId}`
        const mailOptiosn = {
            from: process.env.EMAIL,
            to: emails,
            subject: "Email tracking dead pixel ID",
            html: `
                <h1>tracking ID: ${trackingId}</h1>
                <img src="${TrackingUrl}" width="1" height="1" style="display:none"/>

            `
        }
        await transport.sendMail(mailOptiosn);

    }catch(err){
        console.log(err)
    }
}
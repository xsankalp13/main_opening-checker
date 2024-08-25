import { Hono } from "hono"; 
import { v4 as uuid } from "uuid";
import Track from "../model/track.model";
import { sendMail } from "../utils/sendMain";

const app = new Hono();



app.post('/send-mail', async(c) => {
    const { emails, password } = await c.req.json();

    if(!emails || !password){
        return c.json({error: 'Email and password are required'}, 400)
    }
    
    if(password !== process.env.PASSWORD)
        return c.json({error: 'Invalid credentials'}, 401)


    const trackingId = uuid();
    
    try{
    
        await Track.create({trackingId})
        //send email
        
        await sendMail(emails, trackingId);
        return c.json({message: 'Email sent successfully'})
    }catch{
        return c.json({error: 'An error occurred while sending the email'}, 500)
    }


})

export default app;
import { Hono } from "hono";
import { getConnInfo } from "@hono/node-server/conninfo";
import Track from "../model/track.model";
import { promises as fs } from "fs";



const app = new Hono();

let imgBuffer: Buffer;
(
    async () => {
        try{    
            imgBuffer = await fs.readFile(__dirname + '/assets/banner.gif');
        }catch(err){

            console.log(err)
        }
    }
)();



app.get('/track-mail/:id', async(c) => {
    const id = c.req.param('id');
    if(!id){
        return c.json({error: 'ID is required'}, 400)
    }
    const userIP = c.req.raw.headers.get('true-client-ip') || c.req.raw.headers.get('cf-connecting-ip') || getConnInfo(c).remote.address || '0.0.0.0';
    try {
        const track = await Track.findOne({ trackingId: id});
        if(!track){
            return c.json({error: 'Invalid tracking ID'}, 404)
        }
        if(!track.userIPs.includes(userIP)){
            track.userIPs.push(userIP);
            track.opens++;
            await track.save();
        }

        //image send response
        return new Response(imgBuffer, {
            "headers": {
                "Content-Type": "image/gif",
                "content-length": imgBuffer.length.toString(),
            }
        })
    } catch (error) {
        console.log(error)
        return c.json({error: 'An error occurred while tracking email'}, 500)
    }

})

export default app;

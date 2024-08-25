import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { dbConnect } from './config/db.config';
import sendMailRoute from './api/send-mail';
import trackMailRoute from './api/track-mail'
import getMailStatusRoute from './api/get-mail-status'

require('dotenv').config();

const app = new Hono()

//middleware
app.use(cors());


dbConnect()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

//routes
app.route('/track', trackMailRoute);
app.route('/api', sendMailRoute);
app.route('/status', getMailStatusRoute);

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

import connectDB from './utils/db'
import { v2 as cloudinary} from 'cloudinary'
import http from 'http'
import { app } from './app'
import { initSocketServer } from './socketServer'

require("dotenv").config()

const server = http.createServer(app)

// Cloudinary Config        
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_SECRET_KEY 
});

// Run Socket Server
initSocketServer(server)

// Run Server
server.listen(process.env.PORT, () => {
    connectDB()
    console.log(`Server is connected to port ${process.env.PORT}`)
})
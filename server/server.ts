import connectDB from './utils/db'
import { v2 as cloudinary} from 'cloudinary'
import { app } from './app'

require("dotenv").config()

// Cloudinary Config        
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_SECRET_KEY 
});

// Run Server
app.listen(process.env.PORT, () => {
    connectDB()
    console.log(`Server is connected to port ${process.env.PORT}`)
})
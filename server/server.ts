import connectDB from './utils/db'
import { app } from './app'

require("dotenv").config()

app.listen(process.env.PORT, () => {
    connectDB()
    console.log(`Server is connected to port ${process.env.PORT}`)
})
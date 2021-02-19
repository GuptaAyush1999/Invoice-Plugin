import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import colors from 'colors'
import userRoutes from './routes/userRoutes.js'
import invoiceRoutes from './routes/invoiceRoutes.js'

import connectDB from './config/db.js'


dotenv.config()

connectDB()

const app = express()

app.use(cors())

app.use(express.json())

app.get('/',(req,res)=>{
    res.json('hello')
})

app.use('/api/users', userRoutes)
app.use('/api/invoices',invoiceRoutes)




const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
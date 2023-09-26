import express from 'express'
import { newPayment, sendStripePublishableKey } from '../controllers/payment.controller'
import { isAuthenticated } from '../middleware/auth'

const paymentRouter = express.Router()

paymentRouter.get('/payment/stripepublishablekey', sendStripePublishableKey)
paymentRouter.post('/payment', isAuthenticated, newPayment)

export default paymentRouter

import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";

require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//---------------------------------------//Send Stripe Publishable Key//---------------------------------------//
export const sendStripePublishableKey = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
      });
})

//-------------------------------------------------//New Payment//--------------------------------------------//
export const newPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "USD",
        metadata: {
          company: "Sapphire-Sync",
        },
        automatic_payment_methods: { enabled: true },
      });

      res.status(201).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

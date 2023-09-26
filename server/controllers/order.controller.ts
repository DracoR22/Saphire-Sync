import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs"
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { getAllOrdersService, newOrder } from "../services/order.service";
import { redis } from "../utils/redis";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ---------------------------------------------//Create Order//---------------------------------------------//
export const createOrder = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, payment_info } = req.body as IOrder

        // Validate Payment Info
        if(payment_info) {
            if("id" in payment_info) {
                const paymentIntentId = payment_info.id;
                const paymentIntent = await stripe.paymentIntents.retrieve(
                    paymentIntentId
                )

                if(paymentIntent.status !== "succeeded") {
                    return next(new ErrorHandler("Payment not authorized!", 400));
                
                }
            }
        }

        // Get all the user information
        const user = await userModel.findById(req.user?._id)

        // Show error if user already purchased this course
        const courseExistInUser = user?.courses.some((course: any) => course._id.toString() === courseId)

        if(courseExistInUser) {
            return next(new ErrorHandler("You have already purchased this course", 400))
        }

        // Search for the course
        const course = await CourseModel.findById(courseId)

        if(!course) {
            return next(new ErrorHandler("Course not found", 404))
        }

        // Extract Order Data
        const data: any = {
            courseId: course._id,
            userId: user?._id,
            payment_info
        }

        // Send confirmation order email
        const mailData = {
          order: {
            _id: course._id.toString().slice(0, 6),
            name: course.name,
            price: course.price,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})
          },
          user: {
            name: user?.name
          }
        }

        const html = await ejs.renderFile(path.join(__dirname, "../mails/order-confirmation.ejs"), mailData)

        try {
            if(user) {
                await sendMail({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData
                })
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }

        // Update user with its new course
        user?.courses.push(course?._id)

        await redis.set(req.user?._id, JSON.stringify(user))

        await user?.save()

        // Create a new notification to the course admin
           await NotificationModel.create({
            user: user?._id,
            title: "New Order",
            message: `You have a new order for ${course?.name}`
        })

        // Update the number of purchases of the course
        course.purchased ? course.purchased += 1 : (course.purchased = 1)

        await course.save()

        // Send Response To Create Order
        newOrder(data, res, next)

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

//----------------------------------------//Get All Orders --Only Admin//----------------------------------------//
export const getAllOrders = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        getAllOrdersService(res)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

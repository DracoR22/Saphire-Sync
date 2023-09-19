import NotificationModel from "../models/notification.model";
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cron from "node-cron"


//------------------------------------//Get All Notifications --Only Admin//------------------------------//
export const getNotifications = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
   try {
      // Get All Notifications 
      const notifications = await NotificationModel.find().sort({ createdAt: -1 })

      res.status(201).json({
        success: true,
        notifications
      })
   } catch (error: any) {
      return next(new ErrorHandler(error.message, 500))
   }
})

//------------------------------------//Update Notification Status --Only Admin//------------------------------//
export const updateNotification = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await NotificationModel.findById(req.params.id)
        if(!notification) {
            return next(new ErrorHandler("Notification not found", 404))
        } else {
            notification.status ? notification.status = "read" : notification?.status
        }

        await notification.save()

        const notifications = await NotificationModel.find().sort({ createdAt: -1 })

        res.status(201).json({
            success: true,
            notifications
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

//------------------------------------//Delete Notification Status --Only Admin//------------------------------//
// Delete read notifications every 30 days
cron.schedule("0 0 0 * * *", async() => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  await NotificationModel.deleteMany({ status: "read", createdAt: { $lt: thirtyDaysAgo }})
  console.log('Deleted read notification')
})
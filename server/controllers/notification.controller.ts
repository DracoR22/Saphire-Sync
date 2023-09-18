import NotificationModel from "../models/notification.model";
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";


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
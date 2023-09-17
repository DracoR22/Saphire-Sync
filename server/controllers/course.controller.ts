import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from 'cloudinary'
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from 'ejs'
import sendMail from "../utils/sendMail";

//----------------------------------------------//Upload Course//-------------------------------------------//
export const uploadCourse = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract everything from course model
        const data = req.body
        const thumbnail = data.thumbnail

        // Upload the course image to cloudinary
        if(thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            })

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }

        // Upload Course
        createCourse(data, res, next)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

//----------------------------------------------//Edit Course//-------------------------------------------//
export const editCourse = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract everything from course model
        const data = req.body
        const thumbnail = data.thumbnail

        // Get Course Id
        const courseId = req.params.id

        if(thumbnail) {
            // Delete previous course image
            await cloudinary.v2.uploader.destroy(thumbnail.public_id)

            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            })

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }

        //Update Course
        const course = await CourseModel.findByIdAndUpdate(courseId,
             {
             $set: data,
             },
             {new: true}
        )

        res.status(201).json({
            success: true,
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

//-------------------------------------//Get Single Course Without Purchasing//---------------------------------//
export const getSingleCourse = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id

        const isCacheExist = await redis.get(courseId)

         // Only get data from redis if it already exists
        if(isCacheExist) {
          const course = JSON.parse(isCacheExist)
          res.status(200).json({
            success: true,
            course
          })
        } else {
          // Get Course Without Including Purchased Only Information
        const course = await CourseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")

        await redis.set(courseId, JSON.stringify(course))

        res.status(200).json({
            success: true,
            course
        })
      }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

//-------------------------------------//Get All Courses Without Purchasing//---------------------------------//
export const getAllCourses = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const isCacheExist = await redis.get("allCourses")

        // Only get data from redis if it already exists
        if(isCacheExist) {
            const courses = JSON.parse(isCacheExist)
            res.status(200).json({
            success: true,
            courses
          })
        } else {
          // Search All Courses Without Including Purchased Only Information
          const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")

          await redis.set("allCourses", JSON.stringify(courses))

          res.status(200).json({
            success: true,
            courses
         })
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

//-----------------------------------//Get Course Content Only For Valid User//-------------------------------//
export const getCourseByUser = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses
        const courseId = req.params.id

        const courseExists = userCourseList?.find((course: any) => course._id.toString() === courseId)

        if(!courseExists) {
            return next(new ErrorHandler("You are not elegible to access this course", 404))
        }

        const course = await CourseModel.findById(courseId)
        const content = course?.courseData

        res.status(200).json({
            success: true,
            content
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

//---------------------------------------//Add Questions In Course//------------------------------------//
interface IAddQuestionData {
    question: string
    courseId: string
    contentId: string
}

export const addQuestion = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, courseId, contentId }: IAddQuestionData = req.body

        //Get Course Id
        const course = await CourseModel.findById(courseId)

        if(!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400))
        }

        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId))

        if(!courseContent) {
            return next(new ErrorHandler("Invalid content id", 400))
        }

        // Create a new question object
        const newQuestion: any = {
            user: req.user,
            question,
            questionReplies: []
        }

        // Add this question to the course content
        courseContent.questions.push(newQuestion)

        // Save the updated course
        await course?.save()

        res.status(200).json({
            success: true,
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

//---------------------------------------//Add Answer In Question//------------------------------------//
interface IAddAnswerData {
    answer: string
    courseId: string
    contentId: string
    questionId: string
}

export const addAnswer = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { answer, courseId, contentId, questionId }: IAddAnswerData = req.body

        // Get Course Id
        const course = await CourseModel.findById(courseId)

        if(!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400))
        }

        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId))

        if(!courseContent) {
            return next(new ErrorHandler("Invalid content id", 400))
        }

        // Get the question
        const question = courseContent?.questions?.find((item: any) => item._id.equals(questionId))

        if(!question) {
            return next(new ErrorHandler("Invalid question id", 400))
        }

        // Create An Answer Object
        const newAnswer: any = {
            // Answer creator is the current user
            user: req.user,
            answer
        }

        // Add This Answer To Course Content
        question.questionReplies?.push(newAnswer)

        await course?.save()

        // Create a notification if the current user is the one who created the answer
        if(req.user?._id === question.user._id) {
            // Create a notification
        } else {
            // If the user is not who created that answer we are sending an email
            const data = {
                name: question.user.name,
                title: courseContent.title
            }

            const html = await ejs.renderFile(path.join(__dirname, "../mails/question-reply.ejs"), data)

            try {
                await sendMail({
                  email: question.user.email,
                  subject: "Question Reply",
                  template: "question-reply.ejs",
                  data
                })
            } catch (error: any) {
                return next (new ErrorHandler(error.message, 400))
            }
        }

        res.status(200).json({
            success: true,
            course
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

//---------------------------------------//Add Review In Course//------------------------------------//
interface IAddReviewData {
    review: string
    rating: number
    userId: string
}

export const addReview = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses
        const courseId = req.params.id

        // Check if courseId already exists in userCourseList based on _id
        const courseExists = userCourseList?.some((course: any) => course._id.toString() === courseId.toString())

        if(!courseExists) {
            return next(new ErrorHandler("You are not elegible to access this course", 404))
        }

        const course = await CourseModel.findById(courseId)

        const { review, rating } = req.body as IAddReviewData

        // Create the review
        const reviewData: any = {
            user: req.user,
            comment: review,
            rating
        }

        // Push review to the course model
        course?.reviews.push(reviewData)

        // Add rating to the course based on reviews average
        let avg = 0
        course?.reviews.forEach((rev: any) => { avg += rev.rating })

        if(course) {
           course.ratings = avg / course?.reviews.length
        }

        await course?.save()

        const notification = {
            title: "New Review Received",
            message: `${req.user?.name} has given a review in ${course?.name}`
        }

        // create notification

        res.status(200).json({
            success: true,
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})
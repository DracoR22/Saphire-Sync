import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from 'cloudinary'
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from 'ejs'
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import axios from "axios";

//----------------------------------------------//Create Course//-------------------------------------------//
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

        // Get Course Data
        const courseData = await CourseModel.findById(courseId) as any;

        if (thumbnail && !thumbnail.startsWith("https")) {
            await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);
    
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
              folder: "courses",
            });
    
            data.thumbnail = {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            };
          }
    
          if (thumbnail.startsWith("https")) {
            data.thumbnail = {
              public_id: courseData?.thumbnail.public_id,
              url: courseData?.thumbnail.url,
            };
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

        // Remove Course From Redis After 7 Days Of Inactivity
        await redis.set(courseId, JSON.stringify(course), 'EX', 604800)

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
          // Search All Courses Without Including Purchased Only Information
          const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")

          res.status(200).json({
            success: true,
            courses
         })
        }
     catch (error: any) {
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

        // Get the content of a course
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

        // Send notification to the admin when question is created
        await NotificationModel.create({
            user: req.user?._id,
            title: "New Question Received",
            message: `You have a new question in ${courseContent.title}`
        })

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
            answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        // Add This Answer To Course Content
        question.questionReplies?.push(newAnswer)

        await course?.save()

        // Create a notification if the current user is the one who created the answer
        if(req.user?._id === question.user._id) {
            // Create a notification
            await NotificationModel.create({
                user: req.user?._id,
                title: "New Question Reply Received",
                message: `You have a new question reply in ${courseContent.title}`
            })
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
             // Review creator is the current user
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

        // Update Redis Data Base
        await redis.set(courseId, JSON.stringify(course), "EX", 604800) // 7 Days

        // create notification
        await NotificationModel.create({
            user: req.user?._id,
            title: "New Review Received",
            message: `${req.user?.name} has given a review in ${course?.name}`,
          });
    

        res.status(200).json({
            success: true,
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

//-------------------------------------------//Add Reply In Review//-----------------------------------------//
interface IAddReviewData {
    comment: string
    courseId: string
    reviewId: string
}

export const addReplyToReview = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { comment, courseId, reviewId } = req.body as IAddReviewData

        const course = await CourseModel.findById(courseId)

        if(!course) {
            return next(new ErrorHandler("Course not found", 404))
        }

        const review = course.reviews.find((rev: any) => rev._id.toString() === reviewId)

        if(!review) {
            return next(new ErrorHandler("Review not found", 404))
        }

        // Create reply
        const replyData: any = {
            // Reply creator is the current user
            user: req.user,
            comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        if(!review.commentReplies) {
            review.commentReplies = []
        }

        // Push reply to the course reviews
        review.commentReplies?.push(replyData)

        // Save the course
        await course?.save()

        // Update Redis Data Base
        await redis.set(courseId, JSON.stringify(course), "EX", 604800) // 7 Days

        res.status(200).json({
            success: true,
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

//----------------------------------------//Get All Courses --Only Admin//----------------------------------------//
export const getAdminCourses = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        getAllCoursesService(res)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

//-----------------------------------------//Delete Course --Only Admin//---------------------------------------//
export const deleteCourse = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        const course = await CourseModel.findById(id)

        if(!course) {
            return next(new ErrorHandler("Course not found", 404))
        }

        await course.deleteOne({id})

        await redis.del(id)

        res.status(200).json({
            success: true,
            message: "Course deleted succesfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

//-----------------------------------------//Generate Video Url//---------------------------------------//
export const generateVideoUrl = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.body
        const response = await axios.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, 
        { ttl: 300 }, { headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`
        }})
        
        res.json(response.data)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

import Content from './content_model'
const User = require('../users/users_model')
import { InternalServerError, CustomError } from '../../../utils/customError'
import responseHandler from '../../../utils/responseHandler'
import validateDate from '../../../utils/checkDate'
import isEmpty from '../../../utils/isEmpty'

export async function createContent(req, res, next) {
    try {
        const userId = req.userData.id
        const { category, topic, content, focusGroup, estimatedDuration, deadline } = req.body
        const isdateValid = validateDate(dueDate)
        if (!isdateValid) {
            return next(new CustomError(422, 'Invalid date entered, Deadline must be after current Date'))
        }
        const user = await User.findOne({ _id: userId, userType: 'mentor' })
        if (!user) return next(new CustomError(401, 'Not authorized'))
        const payload = {
            category,
            estimatedDuration,
            deadline: new Date(deadline),
            content,
            topic,
            focusGroup: focusGroup == 'my mentees' ? user.teamNumber : 'shoman',
            author: userId,
        }
        const newContent = await new Content(payload).save()
        if (!newContent) {
            return next(new CustomError(400, "Content creation wasn't successful"))
        }
        return responseHandler(res, 201, newContent, 'Content has been created successfully')
    } catch (error) {
        next(new InternalServerError(error))
    }
}

export async function getAllContents(req, res, next) {
    try {
        const userId = req.userData.id,
            queryOptions = {}
        let contents,
            totalCount,
            { page, limit, search } = req.query
        page = parseInt(page, 10) || 1
        limit = parseInt(limit, 10) || 10
        if (search) queryOptions['topic'] = { $regex: search, $options: 'i' }
        const user = await User.findById(userId)
        if (!user) return next(new CustomError(401, 'Not authorized'))
        if (user.userType === 'mentee') queryOptions['$or'] = [{ focusGroup: user.teamNumber }, { focusGroup: 'shoman' }]
        contents = await Content.find(queryOptions)
            .skip((page - 1) * limit)
            .limit(limit * 1)
            .sort({ createdAt: -1 })
            .exec()
        totalCount = await Content.countDocuments(queryOptions)
        if (totalCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No content(s) available',
            })
        }
        return res.status(200).json({
            status: 'success',
            totalCount,
            contents,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        })
    } catch (error) {
        next(new InternalServerError(error))
    }
}

export async function getContent(req, res, next) {
    try {
        const { contentId } = req.params,
            { id, role } = req.userData
        const query = { _id: contentId }
        const user = await User.findById(id)
        if (!user) return next(new CustomError(401, 'Not authorized'))
        if (role === 'mentee') query['$or'] = [{ focusGroup: user.teamNumber }, { focusGroup: 'shoman' }]
        const content = await Content.findOne(query)
        if (!content) {
            return next(new CustomError(404, "Content doesn't exist or has been deleted"))
        }
        return responseHandler(res, 200, content, 'Content found')
    } catch (error) {
        next(new InternalServerError(error))
    }
}

export async function deleteContent(req, res, next) {
    const { contentId } = req.params
    try {
        const content = await Content.findByIdAndDelete(contentId)
        if (!content) {
            return next(new CustomError(404, "Content with the ID doesn't exist or has already been deleted"))
        }
        return responseHandler(res, 200, content, 'Learning content deleted successfully')
    } catch (error) {
        next(new InternalServerError(error))
    }
}

export async function updateContent(req, res, next) {
    const { id, role } = req.userData,
        { contentId } = req.params
    try {
        const { deadline } = req.body
        const updatedFields = {},
            query = { _id: contentId }
        if (deadline) {
            const isDateValid = validateDate(deadline)
            if (isDateValid) {
                updatedFields['deadline'] = new Date(deadline)
            } else {
                return next(new CustomError(422, 'Invalid deadline date format entered for updating'))
            }
        }
        if (isEmpty(req.body)) {
            return next(new CustomError(422, 'No changes/updates made yet.'))
        }
        if (role !== 'admin') query['author'] = id
        const updatedContent = await Content.findOneAndUpdate(
            query,
            {
                $set: updatedFields,
            },
            { new: true },
        )
        if (!updatedContent) {
            return next(new CustomError(404, "Content with the ID doesn't exist or has been deleted"))
        }
        return responseHandler(res, 200, updatedContent, 'Task updated successfully')
    } catch (error) {
        next(new InternalServerError(error))
    }
}

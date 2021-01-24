import { body } from 'express-validator'
import Content from './content_model'

const createContentRules = () => {
    return [
        body('category').notEmpty().withMessage('Category field is required').trim(),
        body('topic')
            .notEmpty()
            .withMessage('Topic is required')
            .trim()
            .custom(async (value, {}) => {
                const content = await Content.findOne({ topic: value })
                if (content) {
                    return Promise.reject('Topic name already taken')
                }
                return true
            }),
        body('estimatedDuration').notEmpty().withMessage("Learning Content's estimated duration is required"),
        body('deadline').notEmpty().trim().withMessage("Learning Content's deadline is required").isDate().withMessage('Deadline must be valid'),
        body('content').notEmpty().withMessage('Content field is required'),
        body('focusGroup', 'Focus Group can either be for your mentees or Shoman platform').exists().isIn(['my mentees', 'shoman']),
        // if present the field should be `my mentees' (updates to author's team number) or `shoman` (which is default)
    ]
}

export default {
    createContentRules,
}

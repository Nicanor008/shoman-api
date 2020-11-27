import mongoose, { model } from 'mongoose'

const { Schema } = mongoose

const trackSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        mentees: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        mentors: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        applications: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Application',
            },
        ],
    },
    {
        timestamps: true,
    }
)

export default model('Track', trackSchema)

import { validateProjectInputs } from './validators'
import Project from './project_model'

const mongodb = require('mongodb')

export const CreateProjectController = (req, res) => {
    const newProject = new Project(req.body)
    const { errors, isValid } = validateProjectInputs(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }
    newProject
        .save()
        .then(project => {
            return res.status(201).json({
                message: 'Project created successfully',
                project,
            })
        })
        .catch(error => {
            return res.status(400).json({
                status: 'error',
                message: 'Something went wrong. Please try again',
                error,
            })
        })
}

export const GetProjectsController = (req, res, next) => {
    const query = { isDeleted: false }
    Project.find(query, function (err, projects) {
        if (err) {
            var err = new Error('error occurred')
            return next(err)
        }
        return res.status(200).json({
            status: 'success',
            message: 'All projects',
            projects,
        })
    }).catch(error => {
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong. Try again',
            error,
        })
    })
}

export const GetProjectController = (req, res, next) => {
    const { projectId } = req.params
    const query = { _id: new mongodb.ObjectId(projectId), isDeleted: false }
    Project.findOne(query, function (err, project) {
        if (err) {
            var err = new Error('error occurred')
            return next(err)
        }
        if (!project) {
            return res.status(404).json({
                message: 'Project doest not exits',
            })
        }
        return res.status(200).json({
            status: 'success',
            message: 'Project retrieved successfully',
            project,
        })
    }).catch(error => {
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong. Try again',
            error,
        })
    })
}

export const UpdateProjectController = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: 'Data to update can not be empty!',
        })
    }
    const { projectId } = req.params
    const query = { _id: new mongodb.ObjectId(projectId), isDeleted: false }

    Project.findOneAndUpdate(query, req.body, { useFindAndModify: false })
        .then(project => {
            if (!project) {
                res.status(404).json({ message: 'Project does not exist' })
            } else {
                res.status(201).json({
                    status: 'success',
                    message: 'Project updated successfully.',
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error when updating project with id=' + projectId,
            })
        })
}

export const DeleteProjectController = (req, res) => {
    const { projectId } = req.params
    const query = { _id: new mongodb.ObjectId(projectId), isDeleted: false }

    Project.findOneAndUpdate(query, { isDeleted: true, showmanAccess: true })
        .then(project => {
            if (!project) {
                res.status(404).json({ message: 'Project does not exist' })
            } else {
                res.status(201).json({
                    status: 'success',
                    message: 'Project deleted successfully',
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error when deleting project with id=' + projectId,
            })
        })
}

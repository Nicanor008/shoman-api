import { validateProjectInputs } from './validators'
import Project from './project_model'

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
    Project.find(function (err, projects) {
        if (err) {
            var err = new Error('error occurred')
            return next(err)
        }
        return res.status(200).json({
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


export async function GetProjectController(req, res, next) {
    try {
        const { projectId } = req.params
        const project = await Project.findById(projectId)
        if (!project) {
            return next(new CustomError(404, "Project doesn't exist"))
        }
        return responseHandler(res, 200, project, 'Project retrieved successfully')
    } catch (error) {
        next(new InternalServerError(error))
    }
}
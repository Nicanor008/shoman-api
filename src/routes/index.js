//@ts-check
import userRoutes from '../api/v1/auth'
import menteeRoutes from '../api/v1/mentees'
import trackRoutes from '../api/v1/tracks'
import verifyRoutes from '../api/v1/auth/users'
import teamRoutes from '../api/v1/teams'
import projectRoutes from '../api/v1/project'
import defaultRoute from '../api/default'

const apiPrefix = '/api/v1'

const routes = [userRoutes, verifyRoutes, defaultRoute, menteeRoutes, trackRoutes, teamRoutes, projectRoutes]

export default app => {
    routes.forEach(element => {
        app.use(apiPrefix, element)
    })
    return app
}

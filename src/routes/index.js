//@ts-check
import userRoutes from './api/users'
import verifyRoutes from './endpoints/users'
import defaultRoute from './endpoints/default'

const apiPrefix = '/api/v1'

const routes = [userRoutes, verifyRoutes, defaultRoute]

export default (app) => {
    routes.forEach((element) => {
        app.use(apiPrefix, element)
    })
    return app
}

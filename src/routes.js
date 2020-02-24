import { Router } from 'express';

import UserController from './app/controllers/UserController';
import RecipientsController from './app/controllers/RecipientsController';
import SessionController from './app/controllers/SessionController';

import authmiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.get('/recipients', RecipientsController.index);

routes.use(authmiddleware.loggedIn);
routes.use(authmiddleware.checkAdministrator);

routes.post('/recipients', RecipientsController.store);
routes.put(`/recipients/:id`, RecipientsController.update);
routes.delete(`/recipients/:id`, RecipientsController.delete);

routes.put('/users', UserController.update);

export default routes;

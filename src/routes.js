import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import RecipientsController from './app/controllers/RecipientsController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveriesController from './app/controllers/DeliveriesController';
import DeliverymanDeliveryController from './app/controllers/DeliverymanDeliveryController';
import NotificationController from './app/controllers/NotificationController';

import authmiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// Start session
routes.post('/sessions', SessionController.store);

// register of users
routes.post('/users', UserController.store);

// list recipients
routes.get('/recipients', RecipientsController.index);

// list deliveries by deliveryman
routes.get(`/deliveryman/:id/deliveries`, DeliverymanDeliveryController.index);

// middlewares authentication
routes.use(authmiddleware.loggedIn);
routes.use(authmiddleware.checkAdministrator);

// management of recipients
routes.post('/recipients', RecipientsController.store);
routes.put(`/recipients/:id`, RecipientsController.update);
routes.delete(`/recipients/:id`, RecipientsController.delete);

routes.put('/users', UserController.update);

// management of deliveryman
routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman', DeliverymanController.index);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

// post files
routes.post('/files', upload.single('file'), FileController.store);

// management of deliveries
routes.post('/deliveries', DeliveriesController.store);
routes.get('/deliveries', DeliveriesController.index);
routes.put('/deliveries/:id', DeliveriesController.update);
routes.delete('/deliveries/:id', DeliveriesController.delete);

// notifications
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

export default routes;

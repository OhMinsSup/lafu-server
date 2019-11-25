import { Router } from 'express';
import auth from './api/auth';

const api = Router();

api.use('/v1/auth', auth);

export default api;

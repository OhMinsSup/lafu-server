import { Router } from 'express';
import auth from './api/auth';
import file from './api/file';

const api = Router();

api.use('/api/v1/auth', auth);
api.use('/api/v1/file', file);

export default api;

import * as express from 'express';
import { sendData } from '../controllers/send.data.controller';
import { getData } from '../controllers/get.data.controller';

const router = express.Router();

router.get('/data', sendData.handleRequest);
router.get('/getData', getData);

export default router;
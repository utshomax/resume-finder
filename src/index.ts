import express from 'express';
import morgan from 'morgan';
import { ResumeController } from './controllers/resumeController';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan("dev"));

//route
//TODO: Maybe separate the routes into different files later
app.post('/api/uploadResumeDetails', ResumeController.uploadResume);
app.get('/api/getResumeById/:id', ResumeController.getResumeById);
app.get('/api/getResumeByName/:name', ResumeController.getResumeByName);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
import express from 'express';
import morgan from 'morgan';
import { ResumeController } from './controllers/resumeController';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(morgan("dev"));
//add cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

//route
//TODO: Maybe separate the routes into different files later
app.post('/api/uploadResumeDetails', (req, res) => {
  ResumeController.uploadResume(req, res);
});
app.get('/api/getResumeById/:id', (req, res) => {
  ResumeController.getResumeById(req, res);
});
app.get('/api/getResumeByName/:name', (req, res) => {
  ResumeController.getResumeByName(req, res);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
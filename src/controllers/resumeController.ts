import { Request, Response } from 'express';
import { ResumeModel } from '../models/resumeModel';

const uploadResume = async (req: Request, res: Response) => {
  try {
    const { name, currentJobTitle, currentJobDescription, currentJobCompany } = req.body;

    if (!name || !currentJobTitle || !currentJobDescription || !currentJobCompany) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [firstName, lastName] = name.split(' ');
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'Name must be in "firstName lastName" format' });
    }

    const resume = await ResumeModel.create({
      firstName,
      lastName,
      currentJobTitle,
      currentJobDescription,
      currentJobCompany
    });

    return res.status(200).json({ id: resume.id });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const getResumeById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: 'ID parameter is required' });
    }
    //cehck if id is a uuid
    if (!uuidValidate(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const resume = await ResumeModel.findById(id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    return res.status(200).json([{
      name: `${resume.firstName} ${resume.lastName}`,
      currentJobTitle: resume.currentJobTitle,
      currentJobDescription: resume.currentJobDescription,
      currentJobCompany: resume.currentJobCompany
    }]);
  } catch (error) {
    console.error('Error fetching resume:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const getResumeByName = async (req: Request, res: Response) => {
  try {
    const encodedName = req.params.name;
    if (!encodedName) {
      return res.status(400).json({ error: 'Name parameter is required' });
    }

    const name = decodeURIComponent(encodedName.replace(/\+/g, ' '));
    console.log(name);
    const [firstName, lastName] = name.split(' ');

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'Name must be in "firstName+lastName" format' });
    }

    const resumes = await ResumeModel.findByName(firstName, lastName);
    const formattedResumes = resumes.map(resume => ({
      name: `${resume.firstName} ${resume.lastName}`,
      currentJobTitle: resume.currentJobTitle,
      currentJobDescription: resume.currentJobDescription,
      currentJobCompany: resume.currentJobCompany
    }));

    return res.status(200).json(formattedResumes);
  } catch (error) {
    console.error('Error fetching resumes by name:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const uuidValidate = (uuid: string) => {
  const regexExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regexExp.test(uuid);
}


export const ResumeController = {
  uploadResume,
  getResumeById,
  getResumeByName
};
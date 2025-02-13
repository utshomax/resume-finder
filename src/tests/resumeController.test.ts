import { describe, it, expect, beforeEach, afterEach, afterAll, vi } from 'vitest';
import { Request, Response } from 'express';
import { ResumeController } from '../controllers/resumeController';
import { testDb, setupTestDatabase, clearTestDatabase, closeTestDatabase, createTestResume } from './setup';
import { db } from '../db';
import { ResumeModel } from '../models/resumeModel';

// Mock Request and Response
function mockRequest(params = {}, body = {}) {
  return { params, body } as Request;
}

function mockResponse() {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
}

describe('ResumeController', () => {
  beforeEach(async () => {
    await setupTestDatabase();
    Object.assign(db, testDb);
  });

  afterEach(async () => {
    await clearTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('uploadResume', () => {
    it('should create a new resume', async () => {
      const req = mockRequest({}, {
        name: 'John Doe',
        currentJobTitle: 'Software Engineer',
        currentJobDescription: 'Building awesome software',
        currentJobCompany: 'Tech Corp'
      });
      const res = mockResponse();

      await ResumeController.uploadResume(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: expect.any(String)
      }));
    });

    it('should return 400 for missing required fields', async () => {
      const req = mockRequest({}, { name: 'John Doe' });
      const res = mockResponse();

      await ResumeController.uploadResume(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required fields'
      });
    });

    it('should return 400 for invalid name format', async () => {
      const req = mockRequest({}, {
        name: 'John',
        currentJobTitle: 'Software Engineer',
        currentJobDescription: 'Building awesome software',
        currentJobCompany: 'Tech Corp'
      });
      const res = mockResponse();

      await ResumeController.uploadResume(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Name must be in "firstName lastName" format'
      });
    });
  });

  describe('getResumeById', () => {
    it('should return resume by id', async () => {
      const testData = createTestResume();
      const created = await ResumeModel.create(testData);

      const req = mockRequest({ id: created.id.toString() });
      const res = mockResponse();

      await ResumeController.getResumeById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{
        name: 'John Doe',
        currentJobTitle: testData.currentJobTitle,
        currentJobDescription: testData.currentJobDescription,
        currentJobCompany: testData.currentJobCompany
      }]);
    });

    it('should return 404 for non-existent resume', async () => {
      const req = mockRequest({ id: '6440d632-3e46-499c-9a72-b556c429d36a' });
      const res = mockResponse();

      await ResumeController.getResumeById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Resume not found'
      });
    });
  });

  describe('getResumeByName', () => {
    it('should return resumes by exact name match', async () => {
      const testData = createTestResume();
      await ResumeModel.create(testData);

      const req = mockRequest({ name: 'John+Doe' });
      const res = mockResponse();

      await ResumeController.getResumeByName(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          name: 'John Doe',
          currentJobTitle: testData.currentJobTitle,
          currentJobDescription: testData.currentJobDescription,
          currentJobCompany: testData.currentJobCompany
        }
      ]);
    });

    it('should return partial matches', async () => {
      const testData1 = createTestResume({ firstName: 'John', lastName: 'Smith' });
      const testData2 = createTestResume({ firstName: 'Jane', lastName: 'Evans' });
      await ResumeModel.create(testData1);
      await ResumeModel.create(testData2);

      const req = mockRequest({ name: 'John+Evans' });
      const res = mockResponse();

      await ResumeController.getResumeByName(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'John Smith',
            currentJobTitle: testData1.currentJobTitle
          }),
          expect.objectContaining({
            name: 'Jane Evans',
            currentJobTitle: testData2.currentJobTitle
          })
        ])
      );
    });

    it('should return 400 for invalid name format', async () => {
      const req = mockRequest({ name: 'John' });
      const res = mockResponse();

      await ResumeController.getResumeByName(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Name must be in "firstName+lastName" format'
      });
    });

    it('should return empty array when no matches found', async () => {
      const req = mockRequest({ name: 'NonExistent+Person' });
      const res = mockResponse();

      await ResumeController.getResumeByName(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });
});
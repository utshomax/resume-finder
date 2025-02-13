"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const resumeController_1 = require("../controllers/resumeController");
const setup_1 = require("./setup");
const db_1 = require("../db");
const resumeModel_1 = require("../models/resumeModel");
// Mock Request and Response
function mockRequest(params = {}, body = {}) {
    return { params, body };
}
function mockResponse() {
    const res = {};
    res.status = vitest_1.vi.fn().mockReturnValue(res);
    res.json = vitest_1.vi.fn().mockReturnValue(res);
    return res;
}
(0, vitest_1.describe)('ResumeController', () => {
    (0, vitest_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, setup_1.setupTestDatabase)();
        Object.assign(db_1.db, setup_1.testDb);
    }));
    (0, vitest_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, setup_1.clearTestDatabase)();
    }));
    (0, vitest_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, setup_1.closeTestDatabase)();
    }));
    (0, vitest_1.describe)('uploadResume', () => {
        (0, vitest_1.it)('should create a new resume', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({}, {
                name: 'John Doe',
                currentJobTitle: 'Software Engineer',
                currentJobDescription: 'Building awesome software',
                currentJobCompany: 'Tech Corp'
            });
            const res = mockResponse();
            yield resumeController_1.ResumeController.uploadResume(req, res);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                id: vitest_1.expect.any(String)
            }));
        }));
        (0, vitest_1.it)('should return 400 for missing required fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({}, { name: 'John Doe' });
            const res = mockResponse();
            yield resumeController_1.ResumeController.uploadResume(req, res);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(400);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
                error: 'Missing required fields'
            });
        }));
        (0, vitest_1.it)('should return 400 for invalid name format', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({}, {
                name: 'John',
                currentJobTitle: 'Software Engineer',
                currentJobDescription: 'Building awesome software',
                currentJobCompany: 'Tech Corp'
            });
            const res = mockResponse();
            yield resumeController_1.ResumeController.uploadResume(req, res);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(400);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
                error: 'Name must be in "firstName lastName" format'
            });
        }));
    });
    (0, vitest_1.describe)('getResumeById', () => {
        (0, vitest_1.it)('should return resume by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = (0, setup_1.createTestResume)();
            const created = yield resumeModel_1.ResumeModel.create(testData);
            const req = mockRequest({ id: created.id.toString() });
            const res = mockResponse();
            yield resumeController_1.ResumeController.getResumeById(req, res);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith([{
                    name: 'John Doe',
                    currentJobTitle: testData.currentJobTitle,
                    currentJobDescription: testData.currentJobDescription,
                    currentJobCompany: testData.currentJobCompany
                }]);
        }));
        (0, vitest_1.it)('should return 404 for non-existent resume', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ id: '6440d632-3e46-499c-9a72-b556c429d36a' });
            const res = mockResponse();
            yield resumeController_1.ResumeController.getResumeById(req, res);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(404);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
                error: 'Resume not found'
            });
        }));
    });
    (0, vitest_1.describe)('getResumeByName', () => {
        (0, vitest_1.it)('should return resumes by exact name match', () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = (0, setup_1.createTestResume)();
            yield resumeModel_1.ResumeModel.create(testData);
            const req = mockRequest({ name: 'John+Doe' });
            const res = mockResponse();
            yield resumeController_1.ResumeController.getResumeByName(req, res);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith([
                {
                    name: 'John Doe',
                    currentJobTitle: testData.currentJobTitle,
                    currentJobDescription: testData.currentJobDescription,
                    currentJobCompany: testData.currentJobCompany
                }
            ]);
        }));
        (0, vitest_1.it)('should return partial matches', () => __awaiter(void 0, void 0, void 0, function* () {
            const testData1 = (0, setup_1.createTestResume)({ firstName: 'John', lastName: 'Smith' });
            const testData2 = (0, setup_1.createTestResume)({ firstName: 'Jane', lastName: 'Evans' });
            yield resumeModel_1.ResumeModel.create(testData1);
            yield resumeModel_1.ResumeModel.create(testData2);
            const req = mockRequest({ name: 'John+Evans' });
            const res = mockResponse();
            yield resumeController_1.ResumeController.getResumeByName(req, res);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith(vitest_1.expect.arrayContaining([
                vitest_1.expect.objectContaining({
                    name: 'John Smith',
                    currentJobTitle: testData1.currentJobTitle
                }),
                vitest_1.expect.objectContaining({
                    name: 'Jane Evans',
                    currentJobTitle: testData2.currentJobTitle
                })
            ]));
        }));
        (0, vitest_1.it)('should return 400 for invalid name format', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ name: 'John' });
            const res = mockResponse();
            yield resumeController_1.ResumeController.getResumeByName(req, res);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(400);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
                error: 'Name must be in "firstName+lastName" format'
            });
        }));
        (0, vitest_1.it)('should return empty array when no matches found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ name: 'NonExistent+Person' });
            const res = mockResponse();
            yield resumeController_1.ResumeController.getResumeByName(req, res);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith([]);
        }));
    });
});

import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import {Course} from '../../shared/course';

const testCourse: Course = {
  _id: '',
  seqNo: 1,
  url: 'testUrl',
  iconUrl: 'testIconUrl',
  courseListIcon: 'testListIcon',
  description: 'testDescription',
  longDescription: 'testLongDescription',
  category: 'testCategory',
  lessonsCount: 2,
  promo: true
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideProvider(testCourse)
      .useValue(testCourse)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/courses/createCourse (POST)', async (done) => {
    return request(app.getHttpServer())
      .post('/courses/createCourse')
      .send(testCourse)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
        done();
      });
  });

  afterAll(async () => {
    await app.close();
  });

});

import {Test} from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum'
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { EditBookmarkDto, createBookmarkDto } from '../src/bookmark/dto';


describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
  }).compile()

  app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  await app.init();
  await app.listen(3333)

  prisma = app.get(PrismaService)

  await prisma.cleanDb()
  pactum.request.setBaseUrl('http://localhost:3333')
  });
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto ={
      email: 'v@gmail.com',
      password: '123'
    }
    describe('Signup', () => { 
      it('should throw an error if email empty', () => {
        return pactum
        .spec()
        .post(
        '/auth/signup',
        ).withBody({
          email: dto.email
        })
        .expectStatus(400);
      }) 

      it('should throw an error if password empty', () => {
        return pactum
        .spec()
        .post(
        '/auth/signup',
        ).withBody({
          password: dto.password
        })
        .expectStatus(400);
      })

      it('should throw an error if body empty', () => {
        return pactum
        .spec()
        .post(
        '/auth/signup',
        )
        .expectStatus(400);
      })

      it('should signup', () => {
        return pactum
        .spec()
        .post(
        '/auth/signup',
        ).withBody(dto)
        .expectStatus(200);
      })
    })

    describe('Signin', () => { 
      it('should throw an error if email empty', () => {
        return pactum
        .spec()
        .post(
        '/auth/signin',
        ).withBody({
          email: dto.email
        })
        .expectStatus(400);
      }) 

      it('should throw an error if password empty', () => {
        return pactum
        .spec()
        .post(
        '/auth/signin',
        ).withBody({
          password: dto.password
        })
        .expectStatus(400);
      })

      it('should throw an error if body empty', () => {
        return pactum
        .spec()
        .post(
        '/auth/signin',
        )
        .expectStatus(400);
      })
      it('should signin', () => {
        return pactum
        .spec()
        .post(
        '/auth/signin',
        ).withBody(dto)
        .expectStatus(200)
        .stores('userAt', 'access_token')
      })
     })
  });

  describe('User', () => {

    describe('Get me', () => { 
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .inspect()

      })
     })

    describe('Edit user', () => { 
      it('should edit user', () => {
        const dto: EditUserDto ={
          firstName: "Vladimir",
          email: "vlad@gmail.com"
        }
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email)
      })
     })

   });

  describe('Bookmarks', () => { 
    describe('Get empty Bookmarks', () => { 
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBody([])
      })
     })


    describe('Create Bookmark', () => { 
      const dto: createBookmarkDto = {
        title: "First Bookmark",
        link: "http://google.com"
      }
      it('should create bookmark', () => {
        return pactum
        .spec()
        .post('/bookmarks')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .withBody(dto)
        .expectStatus(201)
        .stores('bookmarkId', 'id')
      })
     })


    describe('Get Bookmarks', () => { 
      it('should get bookmarks', () => {
      return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
        .expectJsonLength(1)
    })
     })

     describe('Get bookmarks by id', () => { 
      it('should get bookmarks by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
      })
      })

    describe('Edit bookmark by id', () => { 
      const dto: EditBookmarkDto = {
        title: 'Kubernetes',
        description: 'Kubernetes is great'
      }
      it('should edit bookmarks', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
      })
     })

    describe('Delete Bookmark', () => { 
      it('should delete bookmarks', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(204)
      })

      it('should get empty bookmarks', () => {
        return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
        .expectJsonLength(0)
      })
     })

   })
});





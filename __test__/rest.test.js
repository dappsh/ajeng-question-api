const app = require('../app') // Link to your server file
const request = require('supertest')

it('should handle an 404 response in expect callback', (done) => {
  request(app)
  .get('/questions')
  .timeout(1)
  .expect(404, (err) => {
    done();
  });
});

it('should success get question', async () => {
  await request(app)
    .get('/questions')
    expect(200)
})

it('should handle an 404 response in expect callback', (done) => {
  request(app)
  .post('/questions')
  .send({
    question: 'Tes',
    allow_none: 1,
    shuffle_order: 0,
    respondent: [{ answer: 'answer tes', optionId: 1}]
  })
  .timeout(1)
  .expect(404, (err) => {
    done();
  });
});

it('Should success post new question', async () => {
  await request(app)
    .post('/questions')
    .send({
      question: 'Tes',
      allow_none: 1,
      shuffle_order: 0,
      respondent: [{ answer: 'answer tes', optionId: 1}]
    })
    expect(200)
})
const conn = require('./config')
const app = require('./app.js')


const port = 3000;
const baseUrl = 'http://localhost:'+port;

// === GET ALL "QUESTION" ===
app.get('/questions',  (req, res) => {

// data all question 
conn.query(`
  SELECT
    q.id, q.question, q.allow_none, q.shuffle_order
  FROM questions as q`, (err, results) => {
    if(err) throw err;

      // data all respondent
      conn.query(`
        SELECT r.id, r.question_id, r.option_id, r.answer
        FROM respondent as r`, (err, resRespondent) => {
        if(err) throw err;

        // grouping respondent data by its question_id
        /* example ==== {  
          'question_id': {respondent.answer: '...', respondent.option_id: '...' },
          'question_id': {respondent.answer: '...', respondent.option_id: '...' }
        } 
        */
        const respondentByQuestionId = {};
        for(const {id, question_id, answer, option_id} of resRespondent) {
          if(!respondentByQuestionId[question_id]) respondentByQuestionId[question_id] = [];
          respondentByQuestionId[question_id].push({ id, answer, option_id });
        }
        
        // add new object key questions.respondent into questions result data
          for(i = 0; i < results.length; i++) {
            const questionId = results[i]['id']
            results[i]['respondent'] = respondentByQuestionId[questionId] ?? []
          }

        res.json({"status": 200, "error": null, "data": results});
      });
  });
});
  

// === POST "QUESTION" ===

app.post('/questions', (req, res) => {
  // data to be updated
  let data = {
    question: req.body.question,
    allow_none: req.body.allowNone,
    shuffle_order: req.body.shuffleOrder,
  }
  conn.query('INSERT INTO questions SET ?', data, (err, results) => {
    if(err) throw err;
    const values = req.body.respondent.map(data => [results.insertId, data.optionId, data.answer]);
    conn.query('INSERT INTO respondent (question_id, option_id, answer) VALUES ?', [values], (err2, results2) => {
      res.json({"status": 200, "error": null, "data": results2});
    })
  });
});


// === UPDATE "QUESTION" ===

app.put('/questions/:id', (req, res) => {
  const haveIDs = []; // will store req.body.respondent data that already has id
  const haveNoIDs = []; // will store req.body.respondent data that doesn't have id
  const IDs = []; // will store id of req.body.respondent data

  // data to be updated
  let data = {
    question: req.body.question,
    allow_none: req.body.allowNone,
    shuffle_order: req.body.shuffleOrder,
  }

  conn.query(`UPDATE questions SET ? WHERE id = ${req.params.id}`, data, (err, results) => {
    if(err) throw err;
    const q = {
      option_id: '',
      answer: '',
    };

    // UPDATE RESPONDENT DATA
    req.body.respondent.map(item => {
      // if body.respondent has id, push optionId & answer into array
      if (!!item.id) {
        q.option_id += `WHEN ${item.id} THEN '${item.optionId}' `
        q.answer += `WHEN ${item.id} THEN '${item.answer}' `
        IDs.push(item.id);
        haveIDs.push([item.optionId, item.answer]);
      }
      // if body.respondent doesn't have id, push question_id, optionId & answer into array
      // to create new respondent
      else haveNoIDs.push([req.params.id, item.optionId, item.answer]);
    });
   
    // update respondent data
    conn.query(`
      UPDATE respondent 
        SET
          option_id = (CASE id ${q.option_id} END),
          answer = (CASE id ${q.answer} END)
        WHERE id IN (${IDs.join()})`,  (err2, results2) => {});

    // create new respondent data
    if (!!haveNoIDs) {
      conn.query(`INSERT INTO respondent (question_id, option_id, answer) VALUES ?`, [haveNoIDs], (err, results) => {
        res.json({"status": 200, "error": null, "data": results});
      })
    }
  });
});

// === DELETE "QUESTION RESPONDENT" BY ID ===
// considering question form on FrontEnd side, we will delete respondent immadiately
app.delete('/respondent/:id', (req, res) => {
  conn.query(`DELETE From respondent where id = ${req.params.id}`, (err, results) => {
    if(err) throw err;
    res.json({"status": 200, "error": null, "data": results});
  });
});

// ==== DELETE "QUESTION" ==== 
// delete question & respondent data
app.delete('/questions/:id', (req, res) => {
  conn.query(`DELETE From questions where id = ${req.params.id}`, (err, results) => {
    if(err) throw err;
    res.json({"status": 200, "error": null, "data": results});
  });
});

app.listen(port, () => console.log("question-rest-api run on "+baseUrl ))
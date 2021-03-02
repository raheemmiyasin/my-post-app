const express = require('express');
const axios = require('axios');
const router = express.Router();

const apiUrl = 'https://jsonplaceholder.typicode.com';

/* GET comments listing. */
router.get('/', async function (req, res, next) {
  try {
    let commentsApiUrl = `${apiUrl}/comments`
    // flexible query
    if (req.query) {
      const queries = new URLSearchParams(req.query);
      commentsApiUrl += `?${queries.toString()}`;
      console.log(commentsApiUrl);
    }
    const response = await axios.get(commentsApiUrl);

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});


module.exports = router;

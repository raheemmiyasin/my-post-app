const express = require('express');
const axios = require('axios');
const router = express.Router();

const apiUrl = 'https://jsonplaceholder.typicode.com';

/* get total comments per post*/
async function setTotalComments(post) {
  try {
    let total = 0;
    const commentsResponse = await axios.get(`${apiUrl}/comments?postId=${post.id}`);
    const comments = commentsResponse.data;
    if (Array.isArray(comments) && comments.length > 0) total = comments.length;

    return Promise.resolve({
      post_id: post.id,
      post_title: post.title,
      post_body: post.body,
      total_number_of_comments: total
    });
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

/* GET single post. */
router.get('/:id', async function (req, res, next) {
  try {
    const postResponse = await axios.get(`${apiUrl}/posts/${req.params.id}`);
    const post = await setTotalComments(postResponse.data);
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

/* GET posts listing. */
router.get('/', async function (req, res, next) {
  try {
    const response = await axios.get(`${apiUrl}/posts`);
    let posts = response.data;

    const results = [];
    for (const post of posts) {
      results.push(setTotalComments(post));
    }
    posts = await Promise.all(results)

    // sort posts based on total comments descending
    posts = posts.sort((a, b) => b.total_number_of_comments - a.total_number_of_comments);

    console.log(posts);
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});


module.exports = router;

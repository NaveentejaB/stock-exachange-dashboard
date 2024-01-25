const express = require('express')
const user = require('../controllers/user')

const userRouter = express.Router()

// end point to fetch data from the api to the database
userRouter.get('/',user.fetchTenFromApi)

// end point to fetch from the database which was saved
userRouter.get('/data',user.getData)

module.exports = userRouter


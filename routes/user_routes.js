const express = require('express')
const user = require('../controllers/user')

const userRouter = express.Router()

userRouter.get('/',user.fetchTenFromApi)

userRouter.get('/data',user.getData)

module.exports = userRouter


const express = require('express')

const userController = require('../controllers/user')

const router = express.Router()

router.post(
  '/v1/user/create', userController.signUp
)
router.post(
    '/v1/user/login', userController.login
)
router.put(
    '/v1/user/changepwd', userController.changePassword
)
router.get(
    '/v1/user/getuser/:userId', userController.getUser
)
router.get(
    '/v1/user/list/', userController.listUsers
)
router.delete(
    '/v1/user/delete/:userId', userController.deleteUser
)
module.exports = router

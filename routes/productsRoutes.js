const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController.js')
const authController = require('../controllers/authController.js')

//Crud:
router.post('/create', productController.create)
router.get('/', authController.isAuthenticated, productController.readAll, (req, res)=>{
    res.render('index', {username: res.locals.username, userId: res.locals.userId})
})
router.post('/update', productController.update)
router.get('/remove/:id', productController.remove)

//user
router.get('/login', (req, res)=>{
    res.render('login', {alert:false})
})
router.get('/register', (req, res)=>{
    res.render('register', {alert:false})
})

router.post('/login', authController.login)
router.post('/register', authController.register)
router.get('/logout', authController.logout)

module.exports = router

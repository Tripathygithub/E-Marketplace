var express = require('express');
var router = express.Router();

var adminsRouter=require('./admin')
var usersRouter=require('./user')


const middleware = require('../../service/middleware').middleware;




const userAuthController=require('../../controllers/auth/user');
router.post('/user/register',userAuthController.register);
router.post('/user/login',userAuthController.login);



router.use(middleware); 

router.use('/admin',adminsRouter)
router.use('/user',usersRouter)
module.exports = router;
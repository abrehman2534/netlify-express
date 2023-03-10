const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);


  router
  .route('/profile')
  .get(userController.getAllProfile)
  .post(userController.profile);  
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
router.route('/login').post(userController.loginUser);
router.route('/forgotPassword').post(userController.forgotPassword);
router.route('/resetPassword/:token').patch(userController.resetPasssword);

router
  .route('/profile')
  .get(userController.getAllProfile)
  .post(userController.profile);
module.exports = router;

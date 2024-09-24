const express = require('express')
const router = express.Router() 
const {
    authUser, 
    registerUser, 
    getUserProfile, 
    updateUserProfile, 
    getUsers, 
    deleteUser, 
    getUserById, 
    updateUser
} = require('../controllers/userController')
const {protect, admin} = require('../middleware/authMiddleware')

router 
    .route('/')
    .get(protect, admin, getUsers)
    .post(registerUser) 
router
    .post('/login', authUser)

router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)

router
    .route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, getUserById)
    .put(protect, updateUser)

module.exports = router
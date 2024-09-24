const express = require('express')
const router = express.Router() 
const {
    createReason, 
    getAllReasons, 
    getReasonByID, 
    updateReason, 
    deleteReason
} = require('../controllers/reasonController')
const {protect, admin} = require('../middleware/authMiddleware')

router 
    .route('/')
    .get(protect, getAllReasons)
    .post(protect, admin, createReason)

router
    .route('/:id')
    .get(protect, admin, getReasonByID)
    .put(protect, admin, updateReason)
    .delete(protect, admin, deleteReason)
    
module.exports = router
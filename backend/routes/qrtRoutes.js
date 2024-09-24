const express = require('express')
const router = express.Router() 
const {
    createQRT, 
    getQRTs, 
    getQRTByID, 
    updateQRT, 
    deleteQRT, 
    completeQRT,
    completeQRTActionItem
} = require('../controllers/qrtController')
const {protect, admin} = require('../middleware/authMiddleware')

router
    .route('/')
    .get(protect, getQRTs)
    .post(protect, createQRT)


router
    .route('/:id')
    .get(protect, getQRTByID)
    .put(protect, updateQRT)
    .delete(protect, admin, deleteQRT)


router
    .route('/:id/complete/all')
    .put(protect, completeQRT)

router 
    .route('/:qrtId/actionItem/:actionItemId')
    .put(protect, completeQRTActionItem)


module.exports = router
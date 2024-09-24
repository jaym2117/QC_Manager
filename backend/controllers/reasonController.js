const asyncHandler = require('express-async-handler')
const {Sequelize} = require('sequelize')
const Reason = require('../models/reasonModel')

// @desc    Create a new reason 
// @route   POST /api/reason
// @access  Private/Admin 
const createReason = asyncHandler(async (req, res) => {
    const reason = await Reason.create({
        reasonType: req.body.reasonType
    })

    const createdReason = await reason.save() 

    res.status(201).json(createdReason)
})

// @desc    Fetch all reasons 
// @route   GET /api/reasons
// @access  Private
const getAllReasons = asyncHandler(async (req, res) => {
    const reasons = await Reason.findAll()

    res.json(reasons)
})

// @desc    Get a reason by id 
// @route   GET /api/reason/:id
// @access  Private/Admin
const getReasonByID = asyncHandler(async (req, res) => {
    const reason = await Reason.findByPk(req.params.id)

    if (reason) {
        res.json(reason)
    } else {
        res.status(404)
        throw new Error('Reason not found')
    }
})

// @desc    Update a reason 
// @route   PUT /api/reason/:id
// @access  Private/Admin
const updateReason = asyncHandler(async (req, res) => {
    const {reasonType} = req.body 
    const reason = await Reason.findByPk(req.params.id)

    if (reason) {
        reason.reasonType = reasonType
        const updatedReason = await reason.save()
        res.json(updatedReason)
    } else {
        res.status(404)
        throw new Error('Reason not found')
    }
})

// @desc    Delete a reason 
// @route   DELETE /api/reason/:id
// @access  Private/Admin
const deleteReason = asyncHandler(async(req, res) => {
    const reason = await Reason.findByPk(req.params.id)

    if (reason) {
        await Reason.destroy({where: {id: req.params.id}})
        res.json({message: 'Reason was deleted'})
    } else {
        res.status(404)
        throw new Error('Reason not found')
    }
})

module.exports = {
    createReason, 
    getAllReasons, 
    getReasonByID, 
    updateReason, 
    deleteReason
}
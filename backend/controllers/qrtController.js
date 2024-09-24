const asyncHandler = require('express-async-handler')
const { Sequelize } = require('sequelize')
const Op = Sequelize.Op; 
const ActionItem = require('../models/actionItemModel')
const Reason = require('../models/reasonModel')
const QRT = require('../models/qrtModel')

// @desc    create a new QRT 
// @route   POST /api/qrt
// @access  Private
const createQRT = asyncHandler(async (req, res) => {
    const { jobNumber, qrtType, reasonId, requiredDate, reasonDesc, actionItems, assignedTo } = req.body;
    const generatedBy = `${req.user.firstName} ${req.user.lastName}`;
    
    // Creating QRT directly without an intermediate variable since you're immediately saving it.
    const createdQRT = await QRT.create({
        jobNumber, 
        generatedBy, 
        qrtType, 
        reasonId, 
        assignedTo, 
        requiredDate, 
        reasonDesc,
        actionItems 
    }, {
        include: [ActionItem, Reason]
    });

    res.status(201).json(createdQRT);
});


// @desc    Fetch all qrts
// @route   GET /api/qrts
// @access  Private
const getQRTs = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const qrtStatusClause = req.query.showComplete === 'true' ? ['Complete', 'In Progress'] : ['In Progress'];
    const keyword = req.query.keyword || '';

    // Consolidating the repeated where clause into a single variable for DRY principle
    const whereClause = {
        [Op.and]: [
            {
                [Op.or]: [
                    {jobNumber: {[Op.like]: `%${keyword}%`}}, 
                    {generatedBy: {[Op.like]: `%${keyword}%`}},
                    {assignedTo: {[Op.like]: `%${keyword}%`}},
                    {qrtType: {[Op.like]: `%${keyword}%`}},
                    {requiredDate: {[Op.like]: `%${keyword}%`}},
                    {reasonDesc: {[Op.like]: `%${keyword}%`}},
                ]
            },
            {qrtStatus: {[Op.or]: qrtStatusClause}}
        ]
    };

    const count = await QRT.count({where: whereClause});
    const qrts = await QRT.findAll({
        offset: pageSize * (page - 1),
        limit: pageSize,
        where: whereClause,
        include: [{
            model: ActionItem,
            order: [['sortIdx', 'ASC']],
            limit: 999
        }, Reason]
    });

    res.json({qrts, page, pages: Math.ceil(count / pageSize)});
});

// @desc    Get a qrt by ID
// @route   GET /api/qrts/:id
// @access  Private
const getQRTByID = asyncHandler(async (req, res) => {
    const qrt = await QRT.findOne({
        where: { qrtID: req.params.id },
        include: [
            {
                model: ActionItem,
                order: [['sortIdx', 'ASC']],
                limit: 999
            },
            Reason
        ],
    });

    if (!qrt) {
        res.status(404);
        throw new Error('QRT not found');
    }

    res.json(qrt);
});

// @desc    Update a qrt
// @route   PUT /api/qrts/:id
// @access  Private
const updateQRT = asyncHandler(async (req, res) => {
    const { jobNumber, requiredDate, reasonDesc, assignedTo, reasonId, qrtType, actionItems } = req.body;
    const qrt = await QRT.findOne({
        where: { qrtID: req.params.id },
        include: [ActionItem]
    });

    if (!qrt) {
        res.status(404);
        throw new Error('QRT not found');
    }

    // Update qrt fields
    Object.assign(qrt, { qrtType, jobNumber, requiredDate, assignedTo, reasonDesc, reasonId });
    await qrt.save();

    // Update actionItems
    await Promise.all(actionItems.map(async (actionItem) => {
        if (actionItem.id) {
            await ActionItem.update(actionItem, {
                where: { id: actionItem.id }
            });
        } else {
            await ActionItem.create({
                ...actionItem,
                qrtQrtID: req.params.id
            });
        }
    }));

    const updatedQRT = await QRT.findOne({
        where: { qrtID: req.params.id },
        include: [ActionItem, Reason]
    });
    res.json(updatedQRT);
});


// @desc    Delete a QRT
// @route   DELETE /api/qrts/:id
// @access  Private/Admin
const deleteQRT = asyncHandler(async(req, res) => {
    const qrt = await QRT.findOne({where: {qrtID: req.params.id}})

    if (qrt) {
        await QRT.destroy({where: {qrtID: req.params.id}})
        res.json({message: 'QRT was deleted'})
    } else {
        res.status(404)
        throw new Error('QRT not found')
    }
})

// @desc    Complete a QRT 
// @route   POST /api/qrts/:id/complete/all
// @access  Private
const completeQRT = asyncHandler(async(req, res) => {
    const qrt = await QRT.findOne({where: {qrtID: req.params.id}, include: [ActionItem, Reason]})

    if (qrt) {
        qrt.qrtStatus = 'Complete'
        qrt.actionItems.map(async actionItem => {
            let completedActionItem = await ActionItem.findOne({where: {id: actionItem.id}})
            completedActionItem.completed = true; 
            completedActionItem.completedBy = `${req.user.firstName} ${req.user.lastName}`; 
            completedActionItem.completedOn = new Date()

            await completedActionItem.save()
        })

        const completedQRT = await qrt.save() 
        res.json(completedQRT)
    } else {
        res.status(404)
        throw new Error('QRT not found')
    }
})

// @desc    Complete a QRT action item 
// @route   POST /api/qrts/:qrtId/actionItem/:actionItemId
// @route   Private
const completeQRTActionItem = asyncHandler(async(req, res) => {
    const actionItem = await ActionItem.findOne({where: {id: req.params.actionItemId}})

    if (actionItem) {
        actionItem.completed = true; 
        actionItem.completedBy = `${req.user.firstName} ${req.user.lastName}`; 
        actionItem.completedOn = new Date()

        await actionItem.save()

        const qrt = await QRT.findOne({where: {qrtID: req.params.qrtId}, include: [ActionItem, Reason]})

        const qrtIncompleted = qrt.actionItems.filter(actionItem => actionItem.completed === false)
        
        if (qrtIncompleted.length === 0) {
            qrt.qrtStatus = 'Complete'
            await qrt.save()
        }
        
        res.json(qrt)
    } else {
        res.status(404)
        throw new Error('Action Item not found')
    }
})


module.exports = {
    createQRT, 
    getQRTs, 
    getQRTByID, 
    updateQRT, 
    deleteQRT, 
    completeQRT, 
    completeQRTActionItem
}
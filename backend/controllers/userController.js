const asyncHandler = require('express-async-handler')
const generateToken = require('../utils/generateToken.js')
const User = require('../models/userModel')

// @desc    Auth user & get token 
// @route   POST /api/users/login
// @access  Public 
const authUser = asyncHandler(async (req, res) => {
    const {emailAddress, password} = req.body; 

    const user = await User.findOne({where: {emailAddress: emailAddress}})

    if (user && (await user.matchPassword(password))) {
        res.json({
            employeeID: user.employeeID, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            emailAddress: user.emailAddress, 
            department: user.department, 
            isAdmin: user.isAdmin, 
            token: generateToken(user.employeeID)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc    Register a new user 
// @route   POST /api/users
// @access  Private/Admin
const registerUser = asyncHandler(async(req, res) => {
    const {employeeID, firstName, lastName, emailAddress, department, password, isAdmin} = req.body

    const userExists = await User.findOne({where: {employeeID: employeeID}
})

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const newUser = await User.create({
        employeeID, 
        firstName, 
        lastName, 
        emailAddress, 
        department,
        isAdmin, 
        password
    })

    await newUser.saltPassword()
    await newUser.save() 

    if (newUser) {
        res.status(201).json({
            employeeID: newUser.employeeID, 
            firstName: newUser.firsName, 
            lastName: newUser.lastName, 
            emailAddress: newUser.emailAddress, 
            department: newUser.department, 
            isAdmin: newUser.isAdmin,  
            token: generateToken(newUser.employeeID)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
    
})

// @desc    Get user profile 
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findOne({
        where: {
            employeeID: req.user.employeeID
        }, 
        attributes: ['employeeID', 'firstName', 'lastName', 'emailAddress', 'department']
    })

    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findOne({where: {employeeID: req.user.employeeID}})
    
    if (user) {
        user.firstName = req.body.firstName || user.firstName
        user.lastName = req.body.lastName || user.lastName
        user.emailAddress = req.body.emailAddress || user.emailAddress
        user.department = req.body.department || user.department

        if (req.body.password) {
            user.password = req.body.password
            await user.saltPassword()
        }

        const updatedUser = await user.save()

        res.json({
            employeeID: updatedUser.employeeID, 
            firstName: updatedUser.firsName, 
            lastName: updatedUser.lastName, 
            emailAddress: updatedUser.emailAddress, 
            department: updatedUser.department, 
            token: generateToken(updatedUser.employeeID)
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Get all users 
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.findAll({
        attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
    }) 
    res.json(users)
})

// @desc    Delete user 
// @route   DELETE /api/user/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id)
    if (user) {
        await user.destroy()
        res.json({message: 'User removed'})
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})


// @desc    Get user by ID 
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async(req, res) => {
    const user = await User.findOne(
        {
        where: {employeeID: req.params.id}, 
        attributes: {exclude: ['password']}
    })

    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Update user 
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findOne({where: {employeeID: req.body.employeeID}})
    if (user) {
        user.firstName = req.body.firstName || user.firstName
        user.lastName = req.body.lastName || user.lastName
        user.emailAddress = req.body.emailAddress || user.emailAddress
        user.department = req.body.department || user.department
        user.isAdmin = req.body.isAdmin
        
        if (req.body.password) {
            user.password = req.body.password
            await user.saltPassword()
        }
        

        const updatedUser = await user.save()

        res.json({
            employeeID: updatedUser.employeeID, 
            firstName: updatedUser.firsName, 
            lastName: updatedUser.lastName, 
            emailAddress: updatedUser.emailAddress, 
            department: updatedUser.department,
            isAdmin: updateUser.isAdmin, 
            token: generateToken(updatedUser.employeeID)
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

module.exports = {
    authUser, 
    registerUser, 
    getUserProfile, 
    updateUserProfile, 
    getUsers, 
    deleteUser, 
    getUserById, 
    updateUser
}
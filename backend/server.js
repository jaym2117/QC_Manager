const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const {notFound, errorHandler} = require('./middleware/errorMiddleware.js')
const {syncDB} = require('./config/db')

// ROUTES
const userRoutes = require('./routes/userRoutes')
const qrtRoutes = require('./routes/qrtRoutes')
const reasonsRoutes = require('./routes/reasonRoutes')

dotenv.config() 

const app = express() 

syncDB()


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/qrts', qrtRoutes)
app.use('/api/reasons', reasonsRoutes)

app.get('/', (req, res) => {
    res.send('API is running...')
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
    PORT, 
    console.log(`Server is running on port ${PORT}`.yellow.bold)
)
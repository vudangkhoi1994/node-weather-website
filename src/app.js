const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define path for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set up hbs and view engine
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Set up static diretory to serve
app.use(express.static(publicDirectoryPath))

// app.com - index
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather Dynamic',
        name: 'khoivd'
    })
})

// app.com/about
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Dynamic',
        imgURL: '/img/tom_cruise.jpg',
        name: 'khoivd'
    })
})

// app.com/help
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Dynamic',
        errorMsg: 'FAQ',
        name: 'khoivd'
    })
})

// app.com/weather
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "No address is provided"
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, geoData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: geoData,
                location,
                address: req.query.address
            })
        })
    })

})

// app.com - 404
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 page',
        name: 'khoivd',
        errorMsg: 'Help page not found'
    })
})

// app.com - 404
app.get('*', (req, res) => {
    res.render('404', {
        title: '404 page',
        name: 'khoivd',
        errorMsg: 'page not found'
    })
})

// start up server
app.listen(3000, () => {
    console.log('Listen at port 3000')
})
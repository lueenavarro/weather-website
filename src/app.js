const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//Define paths for Express config
const publicDirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
app.use(express.static(publicDirectory))
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.get('', (req, res) =>{
    res.render('index',{
       title: 'Weather',
       name: 'Louie Navarro' 
    })
})

app.get('/about', (req, res) =>{
    res.render('about',{
        title: 'About Me',
        name: 'Louie Navarro' 
     })
})

app.get('/help', (req, res) =>{
    res.render('help',{
        title: 'Help',
        name: 'Louie Navarro',
        message: 'This is your help message!'
     })
})


app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address'
        })
    }
    const location = req.query.address
    geocode(location, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, {summary, temperature, precipProbability, maxTemp, minTemp}={}) => {
            if (error) {
                return  res.send({ error })
            }
            const forecast = summary + ' It is currently ' + temperature + '°C out. There is a ' + precipProbability + '% chance of rain. The high today is ' + maxTemp + '°C with a low of ' + minTemp + '°C.'
            res.send({ location, forecast})
        }) 
    })
})

app.get('/products', (req, res) =>{
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    } 
    
    res.send({
        products: []
    }) 
})

app.get('/help/*', (req , res) => {
    res.render('404',{
        title: '404 help',
        name: 'Louie Navarro',
        error: 'Help article not found!'
    })
})

app.get('*',(req,res) => {
    res.render('404',{
        title: '404',
        name: 'Louie Navarro',
        error: 'Page not found'
    })
})

app.listen(port, ()=>{
    console.log('Server is up on port 3000')
})
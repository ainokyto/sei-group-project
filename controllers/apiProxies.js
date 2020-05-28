const axios = require('axios')
const { trefleToken, pexelsHeader, mapboxToken } = require('../config/environments')

async function getTrefleInfo(req, res) {
  try {
    console.log('backend recieved: ', req.body)
    const query = req.body.search
    const response = await axios.get(`https://trefle.io/api/plants/?q=${query}&token=${trefleToken}`)
    console.log('BE Response', response.data)
    res.status(200).json(response.data)
  } catch (err) {
    res.json(err)
  }
}

async function getLocation() {
  try {
    const res = await axios.get(`mapbox.com/geocoding/vh/mapbox.places/london.json?access_token=${mapboxToken}`)
    console.log(res.data)
  } catch (err) {
    console.log(err)
  }
}

async function photoSearch(req, res) {
  try {
    const randomNumber = Math.floor(Math.random() * 15)
    const searchQuery = req.body.searchquery
    console.log('BE: ', req.body)
    const searchRes = await axios.get(`https://api.pexels.com/v1/search?query=${searchQuery}`, { headers: pexelsHeader })
    const randImage = searchRes.data.photos[randomNumber].src.large2x
    res.status(200).json(randImage)
  } catch (err) {
    res.sendStatus(404)
  }
}

async function getSummary(req, res) {
  try {
    const query = req.body.query
    console.log(query)
    const response = await axios.get(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${query}`)
    console.log(response.data)
    res.status(200).json(response.data)
  } catch {
    res.status(200).json({ extract: 'We could not find any information about this plant' })
  }

}


module.exports = {
  getTrefleInfo,
  getLocation,
  photoSearch,
  getSummary
}
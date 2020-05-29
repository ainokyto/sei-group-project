const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/plants-db3'
const port =  process.env.PORT || 8000

const trefleToken = process.env.TREFLE_TOKEN
const pexelsHeader = { Authorization: process.env.PEXELS_HEADER }
const mapboxToken = process.env.MAPBOX_TOKEN
const secret = process.env.JWT_SECRET

module.exports = {
  dbURI,
  port,
  trefleToken,
  pexelsHeader,
  mapboxToken,
  secret
}
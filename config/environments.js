const trefleToken = process.env.TREFLE_TOKEN
const pexelsHeader = { Authorization: process.env.PEXELS_HEADER }
const mapboxToken = process.env.MAPBOX_TOKEN
const secret = process.env.JWT_SECRET

module.exports = {
  trefleToken,
  pexelsHeader,
  mapboxToken,
  secret
}
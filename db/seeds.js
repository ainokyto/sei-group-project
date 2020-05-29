const mongoose = require('mongoose')
const { dbURI } = require('./config/environments')
const Plant = require('../models/plant')
const User = require('../models/user')
// const faker = require('faker')
// const plantsData = require('./data/plants')
const usersData = require('./data/users')
const axios = require('axios')
const { trefleToken, pexelsHeader } = require('../config/environments') 
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

const commonNames = []
const sciNames = []
const images = []
const locations = []
const heights = []
const plantsData = []

const amount = 150

let treflePage = 1
let pexelsPage = 1

const getPlants = (page) => {
  setTimeout(async () => {
    if (commonNames.length >= amount) return

    const res = await axios.get(`https://trefle.io/api/plants/?token=${trefleToken}&resprout_ability=true&page=${page}`)
    res.data.forEach(plant => {
      if (plant.common_name && plant.scientific_name && commonNames.length < amount) {
        const commonUpper = plant.common_name.split(' ').map(word => {
          return word[0].toUpperCase() + word.slice(1)
        })
        const sciUpper = plant.scientific_name.split(' ').map(word => {
          return word[0].toUpperCase() + word.slice(1)
        })
        commonNames.push(commonUpper.join(' '))
        sciNames.push(sciUpper.join(' '))
      }
    })
    if (commonNames.length >= amount) {
      console.log(`🌱🌲🌳 Grew ${commonNames.length} Plants 🌵🍁🌾`)
      getPhotos(pexelsPage)
      return
    } else {

      treflePage++
      getPlants(treflePage)

    }
  }, 500)
}

const getPhotos = page => {
  setTimeout(async () => {
    if (images.length >= amount) return
    const res = await axios.get(`https://api.pexels.com/v1/search?query=potted%20plant&page=${page}`, { headers: pexelsHeader })
    res.data.photos.forEach(img => {
      if (images.length < amount) {
        images.push(img.src.large)
      }
    })
    if (images.length >= amount) {
      console.log(`📷📸 Took ${images.length} Pictures 📸📷`)
      makeLocations()
      return
    } else {
      pexelsPage++
      getPhotos(pexelsPage)
    }
  }, 500)
}

const makeLocations = () => {
  for (let i = 0; i < amount; i++) {
    const longitude = Math.random() * (0.074628 - -0.303742) + -0.303742
    const latitude = Math.random() * (51.601882 - 51.492854) + 51.492854
    locations.push([{ lat: latitude.toFixed(6), lon: longitude.toFixed(6) }])
  }
  console.log(`👆👇👈👉 Set ${locations.length} Locations 👉👈👇👆`)
  makeHeights()
}

const makeHeights = () => {
  for (let i = 0; i < amount; i++) {
    heights.push(Math.floor(Math.random() * 270))
  }
  console.log(`🏗🏗 Made ${heights.length} height options 🏗🏗`)
  console.log('⏱⌚ Not finished yet, Please Wait ⌚⏱')
  createObjects()
}

const createObjects = () => {
  for (let i = 0; i < amount; i++) {
    plantsData.push({
      name: commonNames[i],
      scientificName: sciNames[i],
      imageUrl: images[i],
      description: lorem,
      height: heights[i],
      location: locations[i]
    })
    // console.log(plantsData[i].location)
  }
}

getPlants(treflePage)
console.log('Sowing Seeds 🌱🌱🌱🌱🌱🌱')


setTimeout(() => {
  mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, async (err, db) => {

    if (err) return console.log(err) // * Any error in connnection will log here

    try {

      await db.dropDatabase()
      // const allUsers = [] // * an array to push our 4 admin users + 300 fake users into


      // for (let index = 0; index < 50; index++) { // * looping to created 300 users
      //   const name = faker.name.findName() // * using the faker package to generate a fake username
      //   allUsers.push({
      //     name: name,
      //     email: `${name.split(' ').join('')}@email.com`, // * created the email from that generated name
      //     password: 'pass', // * setting all the passwords the same
      //     passwordConfirmation: 'pass'
      //   })
      // }

      const users = await User.create(usersData)
      console.log(`${users.length} admin users created 👩‍💻`)

      const plantsWithUsers = plantsData.map(plant => {
        return { ...plant, user: users[Math.floor(Math.random() * users.length)]._id }
      })


      // const createdUsers = await User.create(allUsers) //* also creates our 4 admin users + 300 fake users
      // console.log(allUsers)

      // console.log(`❇️ Created ${createdUsers.length} ❇️`)

      const plants = await Plant.create(plantsWithUsers)
      console.log(`${plants.length} complete plants created`)


      await mongoose.connection.close()
      console.log('Goodbye')

    } catch (err) {
      console.log(err) // * Log any errors that occer
    }

    mongoose.connection.close() // * Close connection at the end
  })
}, 22000)
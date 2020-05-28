import React from 'react'
import { Link } from 'react-router-dom'
import MapGl, { Marker, NavigationControl, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css' //? stylesheet
import { getAllPlants } from '../../lib/api'
import Select from 'react-select'

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN
const mapStyle = 'mapbox://styles/mapbox/light-v10'

//?AK Styles for navigation controllers

const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
}

class Maps extends React.Component {
  state = {
    //?AK Initial positioning for the map passed as props from PlantThumbnail 
    //?AK viewport receives new values with every user interaction 
    viewport: {
      longitude: parseFloat(this.props.location.state.longitude),
      latitude: parseFloat(this.props.location.state.latitude),
      zoom: 12,
      height: '100vh',
      width: '100vw'
    },
    plants: null,
    selectedPlant: null,
    plantShow: null,
    plantProps: this.props.location.state.plantProps,
    plantSelect: false,
    hotPlants: [],
    locationData: {
      latitude: null,
      longitude: null
    }
  }

  //?AK GET request to get plants from database
  //?AK Iterating to produce value and label for Select options
  //?AK Location property is stored as value so that it can be accessed later
  //?AK Control flow to find out if a plant has a nickname key, and concatenate that into label

  async componentDidMount() {
    try {
      const res = await getAllPlants()
      const plants = res.data
      const hotPlants = plants.map(plant => {
        if (plant.nickName) {
          return ({ value: plant.location, label: `${plant.name}, '${plant.nickName}'` })
        } else {
          return ({ value: plant.location, label: plant.name })
        }
      })
      this.setState({ plants })
      this.setState({ hotPlants })
      console.log(this.props)
    } catch (err) {
      console.log(err)
      this.props.history.push('/notfound')
    }
  }

  //?AK Function to handle Select selection
  //?AK Selected plant's location data (stored in value property) sent to state
  //?AK Also toggle plantSelect to true to render 'Hot Plant' popup


  handleSelect = selected => {
    const selectedPlant = selected.value
    const locationData = {
      ...this.state.locationData,
      latitude: parseFloat(selectedPlant[0].lat),
      longitude: parseFloat(selectedPlant[0].lon)
    }
    this.setState({ locationData, plantSelect: true, selectedPlant: null, plantShow: null, plantProps: null }, this.setNewViewport)
    console.log(this.state.plantSelect)
  }

  //?AK Function to take selected plant's locationData from state 
  //?AK Viewport coordinates receive new values so that map takes user to the selected plant 

  setNewViewport = () => {
    let viewport = {
      ...this.state.viewport,
      latitude: parseFloat(this.state.locationData.latitude),
      longitude: parseFloat(this.state.locationData.longitude),
      zoom: 13
    }
    this.setState({ viewport })
  }

  //?AK Simple event handlers to change target plant title colour on mouse hover

  handleMouseEnter = (e) => {
    e.target.style.color = '#3FC008'
  }

  handleMouseLeave = (e) => {
    e.target.style.color = 'black'
  }

  //?AK in render:
  //?AK using the spread operator to get viewport data from state
  //?AK sending new viewport data to state to update UI after each user interaction
  //?AK Mapping over plants array to return a marker for each plant
  //?AK onClick function to send target plant's data to state
  //?AK conditional rendering to show Popups

  render() {

    if (!this.state.plants) return null
    
    const { viewport, plants, selectedPlant, plantShow, plantProps, plantSelect, hotPlants } = this.state
    
    return (
      <>
        {plants && (
          <div className="main">
            <Select
              placeholder={`${hotPlants.length} Hot Plants in your Area are waiting for you...`}
              options={hotPlants}
              onChange={this.handleSelect}
            />
            <div className="map-styles">
            <MapGl
              {...viewport}
              mapboxApiAccessToken={mapboxToken}
              mapStyle={mapStyle}
              onViewportChange={viewport => {
                this.setState({ viewport })
              }}
            >
              <div className="nav" style={navStyle}>
                <NavigationControl />
              </div>
              {plants.map(plant => {
                return <div className="marker"
                  key={plant._id}
                  onMouseEnter={() => {
                    this.setState({ plantShow: plant, plantProps: null, plantSelect: false })
                  }}
                  onMouseLeave={() => {
                    this.setState({ plantShow: null })
                  }}
                  onClick={(event) => {
                    event.preventDefault()
                    this.setState({ selectedPlant: plant, plantShow: null, plantProps: null, plantSelect: false })
                  }}
                >
                  <Marker
                    latitude={parseFloat(plant.location[0].lat)}
                    longitude={parseFloat(plant.location[0].lon)}
                    offsetTop={10}
                    offsetLeft={-12}
                  >
                    <img width={25} src={require("../../lib/plntify_stamp.png")} alt="Plntify Logo" />
                  </Marker>
                </div>
              })
              }
              <div>
                {plantSelect && (
                  <Popup
                    latitude={parseFloat(viewport.latitude)}
                    longitude={parseFloat(viewport.longitude)}
                  >
                    <h2>Hot Plant!</h2>
                  </Popup>
                )}
              </div>
              <div>
                {plantProps && (
                  <Popup
                    latitude={parseFloat(this.props.location.state.latitude)}
                    longitude={parseFloat(this.props.location.state.longitude)}
                    closeOnClick={false}
                    onClose={() => {
                      this.setState({ plantProps: null })
                    }}
                  >
                    <Link to={`/plants/${plantProps.id}`}>
                      <div className="popup-container">
                        <h2 className="has-text-centered"
                          onMouseEnter={this.handleMouseEnter}
                          onMouseLeave={this.handleMouseLeave}>
                          {`${plantProps.name}`}{plantProps.nickName ? `, '${plantProps.nickName}'` : ''}
                        </h2>
                        <hr />
                        <img width={180} src={`${plantProps.imageUrl}`} alt={`${plantProps.name}`} />
                      </div>
                    </Link>
                  </Popup>
                )}
              </div>
              <div>
                {plantShow && (
                  <Popup
                    latitude={parseFloat(plantShow.location[0].lat)}
                    longitude={parseFloat(plantShow.location[0].lon)}
                  >
                    <div className="has-text-centered">
                      <h2>
                        {`${plantShow.name}`}{plantShow.nickName ? `, '${plantShow.nickName}'` : ''}
                      </h2>
                      <p>Click plant!</p>
                    </div>
                  </Popup>
                )}
              </div>
              <div>
                {selectedPlant && (
                  <Popup
                    latitude={parseFloat(selectedPlant.location[0].lat)}
                    longitude={parseFloat(selectedPlant.location[0].lon)}
                    closeOnClick={false}
                    onClose={() => {
                      this.setState({ selectedPlant: null, plantProps: null })
                    }}
                  >
                    <Link to={`/plants/${selectedPlant._id}`}>
                      <div className="popup-container">
                        <h2 className="has-text-centered"
                          onMouseEnter={this.handleMouseEnter}
                          onMouseLeave={this.handleMouseLeave}>
                          {`${selectedPlant.name}`}{selectedPlant.nickName ? `, '${selectedPlant.nickName}'` : ''}
                        </h2>
                        <hr />
                        <img width={180} src={`${selectedPlant.imageUrl}`} alt={`${selectedPlant.name}`} />
                      </div>
                    </Link>
                  </Popup>
                )}
              </div>
            </MapGl >
            </div>
          </div >
        )}
      </>
    )
  }
}

export default Maps
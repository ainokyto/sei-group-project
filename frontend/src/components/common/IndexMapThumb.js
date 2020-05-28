import React from 'react'
import MapGl, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../../lib/auth'


const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN
const mapStyle = 'mapbox://styles/mapbox/light-v10'


const IndexMapThumb = (props) => {
  // console.log('map props',props)
  return (
    <div>
      {isAuthenticated() &&
        <Link to={{
          pathname: '/maps',
          state: {
            latitude: 51.5048,
            longitude: -0.0860,
          }
        }}
        >
        <MapGl
          mapboxApiAccessToken={mapboxToken}
          height={'20vh'}
          width={'100%'}
          mapStyle={mapStyle}
          latitude={51.5070}
          longitude={-0.0860}
          zoom={11}
        >
          {props.plants.map(plant => {
            return <div className="marker"
              key={plant._id}
            >
              <Marker
                latitude={parseFloat(plant.location[0].lat)}
                longitude={parseFloat(plant.location[0].lon)}
                offsetTop={10}
                offsetLeft={-12}
              >
                  <img width={15} src={require("../../lib/plntify_stamp.png")} alt="Plntify Logo" />
                </Marker>
              </div>
            })
            }
          </MapGl>
        </Link>
      }
    </div>
  )
}

export default IndexMapThumb
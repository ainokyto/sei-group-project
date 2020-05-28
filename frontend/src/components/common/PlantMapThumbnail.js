import React from 'react'
import { Link } from 'react-router-dom'
import MapGl, { Marker } from 'react-map-gl' // The map component
import 'mapbox-gl/dist/mapbox-gl.css' // any CSS styling needed to make the map work

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN

const PlantMapThumbnail = (props) => {
  return (
    <>
      <div>
        <Link to={{
          pathname: '/maps',
          state: {
            latitude: parseFloat(props.lat),
            longitude: parseFloat(props.lon),
            plantProps: {
              id: props._id,
              name: props.name,
              nickName: props.nickName,
              imageUrl: props.imageUrl
            }
          }
        }} >
          <MapGl
            mapboxApiAccessToken={mapboxToken}
            height={'30vh'}
            width={'30vw'}
            mapStyle='mapbox://styles/mapbox/light-v10'
            latitude={parseFloat(props.lat)}
            longitude={parseFloat(props.lon)}
            zoom={10}
          >
            <div key={props._id}>
              <Marker
                latitude={parseFloat(props.lat)}
                longitude={parseFloat(props.lon)}
              >
                <img src={require("../../lib/plntify_stamp.png")} alt="Plntify Logo" height="25vh" width="25vw" />
              </Marker>
            </div>
          </MapGl>
        </Link>
      </div>
    </>
  )
}

export default PlantMapThumbnail

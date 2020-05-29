import React from 'react'
import Select from 'react-select'
import { getTrefleData } from '../../lib/api'
import axios from 'axios'

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN
const uploadUrl = process.env.REACT_APP_CLOUDINARY_URL
const uploadPreset = process.env.REACT_APP_CLOUDINARY_BUCKET
const moderatorKey = process.env.REACT_APP_MODERATOR_KEY


class FormPlant extends React.Component {
  state = {
    options: [],
    search: '',
    results: [],
    isLoading: false,
    lon: '',
    lat: '',
    test: '',
    errors: {},
  }
  handleSearchChange = (e) => {
    this.setState({
      search: e.target.value,
      isLoading: true
    })
    // Stop the previous setTimeout if there is one in progress
    clearTimeout(this.timeoutId)
    // Launch a new request in 1000ms
    this.timeoutId = setTimeout(() => {
      this.performSearch()
    }, 1000)
  }
  performSearch = async () => {
    if (this.state.search === "") {
      this.setState({
        results: [],
        isLoading: false
      })
      return
    }
    const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.search}.json?access_token=${mapboxToken}`)
    this.setState({ results: result.data.features, isLoading: false })
  }
  handleItemClicked = async (place) => {
    const search = await place.place_name
    const lon = await place.geometry.coordinates[0]
    const lat = await place.geometry.coordinates[1]
    this.setState({
      lat: lat,
      lon: lon,
      search: search,
      results: []
    })
    // console.log(this.state)
    this.props.onSelect(lat, lon)
  }
  getSciData = async () => {
    if (this.props.formData.name) {
      const sciNames = []
      const splitNames = this.props.formData.name.split(' ')
      const res = await getTrefleData(splitNames[0])
      const plantData = res.data
      plantData.forEach(obj => {
        sciNames.push({ value: obj.scientific_name, label: obj.scientific_name })
      })
      this.setState({ options: sciNames })
    }
  }
  sendData = () => {
    this.props.imageUrl(this.state.imageUrl)
  }
  handleUpload = async event => {
    const data = new FormData()
    data.append('file', event.target.files[0])
    data.append('upload_preset', uploadPreset)
    const res = await axios.post(uploadUrl, data)
    this.checkNaughtyImage(res.data.url)
    // console.log(this.state.imageUrl)
  }
  checkNaughtyImage = async (imgToCheck) => {
    const res = await axios.post(`https://api.moderatecontent.com/moderate/?key=${moderatorKey}&url=${imgToCheck}`)
    const modResponse = res.data.rating_letter
    if (modResponse === 'e') {
      this.setState({ imageUrl: imgToCheck })
      this.sendData()
    } else {
      window.alert('Uploaded an inappropriate image. Please keep your images Family Friendly')
    }
  }
  // console.log('props: ', this.props.formData.name)
  render() {
    const { formData, errors, handleChange, handleSubmit, buttonText, handleSelectChange } = this.props //* deconstructing all props passed by either NewPlant or EditPlant
    // console.log('formplant errors: ', errors)
    return (
      <div className="columns">
        <form onSubmit={handleSubmit} className="column is-half is-offset-one-quarter">
          <div className="field">
            <label className="label">Nickname</label>
            <div className="control">
              <input
                className={`input ${errors.nickName ? 'is-danger' : ''}`} // * using a ternary to attach the class "is-danger" to the input if it is present in the errors object, also only showing the small tag below.
                placeholder="Name"
                name="nickName"
                onChange={handleChange}
                value={formData.nickName}
              />
            </div>
            {errors.nickName ? <small className="help is-danger">{errors.nickName}</small> : ''}
          </div>
          <div className="field">
            <label className="label">Common-Name</label>
            <div className="control">
              <input
                className={`input ${errors.name ? 'is-danger' : ''}`} // * using a ternary to attach the class "is-danger" to the input if it is present in the errors object, also only showing the small tag below.
                placeholder="Name"
                name="name"
                onChange={handleChange}
                value={formData.name}
              />
            </div>
            <div>
            </div>
            {errors.name ? <small className="help is-danger">{errors.name}</small> : ''}
          </div>
          <div className="field">
            <label className="label">Height in Centimeters</label>
            <div className="control">
              <textarea
                className={`input ${errors.height ? 'is-danger' : ''}`}
                placeholder="Height"
                name="height"
                onChange={handleChange}
                value={formData.height}
              />
            </div>
            {errors.height && <small className="help is-danger">{errors.height}</small>}
          </div>
          <div className="field">
            <label className="label">Scientific Name</label>
            <div className={`control ${errors.scientificName ? 'is-danger' : ''}`}
              onClick={this.getSciData}
            >
              <Select
                name="scientificName"
                onChange={handleSelectChange}
                options={this.state.options}
              />
            </div>
            {errors.scientificName && <small className="help is-danger">{errors.scientificName}</small>}
          </div>
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className={`textarea ${errors.description ? 'is-danger' : ''}`}
                placeholder="Describe your specific plant. We will add general descriptions for you"
                type="textarea"
                name="description"
                rows="5"
                cols="50"
                wrap="hard"
                onChange={handleChange}
                value={formData.description}
              />
            </div>
            {errors.description && <small className="help is-danger">{errors.description}</small>}
          </div>
          <div>
            <label className="label">Upload Image</label>
            <input
              className={`input ${errors.imageUrl ? 'is-danger' : ''}`}
              type="file"
              onChange={this.handleUpload}
            />
            {formData.imageUrl ? <img src={formData.imageUrl} alt="User's Upload"></img> : ''}
          </div>
          {errors.imageUrl && <small className="help is-danger">{errors.imageUrl}</small>}
          <div className="field">
            <label className="label">Location</label>
            <div className={`control ${errors.description ? 'is-danger' : ''}`}>
              <div className="AutocompletePlace">
                <input
                  className="input AutocompletePlace-input" type="text" value={this.state.search} onChange={this.handleSearchChange} placeholder="Type an address"
                />
                <ul className="AutocompletePlace-results">
                  {this.state.results.map(place => (
                    <li
                      key={place.id}
                      className="AutocompletePlace-items"
                      onClick={() => this.handleItemClicked(place)}
                    >
                      {place.place_name}
                    </li>
                  ))}
                  {this.state.isLoading && <li className="AutocompletePlace-items">Loading...</li>}
                </ul>
              </div>
            </div>
            {errors.location && <small className="help is-danger">{errors.location}</small>}
          </div>
          <div className="field">
            <button type="submit" className="button is-fullwidth form-add-my-plant-button">{buttonText}</button>
          </div>
        </form>
      </div>
    )
  }
}
export default FormPlant
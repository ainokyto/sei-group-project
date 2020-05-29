import React from 'react'
import axios from 'axios'

const uploadUrl = process.env.REACT_APP_CLOUDINARY_URL
const uploadPreset = process.env.REACT_APP_CLOUDINARY_BUCKET

class ImageUpload extends React.Component {
  state = {
    image: null
  }

  handleUpload = async event => {
    const data = new FormData()
    data.append('file', event.target.files[0])
    data.append('upload_preset', uploadPreset)
    const res = await axios.post(uploadUrl, data)
    this.setState({
      image: res.data.url
    }
    )
  }

  render() {
    const { image } = this.state
    return (
      <>
        {image ?
          <div>
            <img src={image} alt="selected"></img>
          </div>
          :
          <>
            <label className="label">{this.props.labelText || 'Upload Image'}</label>
            <input
              className="input"
              type="file"
              onChange={this.handleUpload}
            />
          </>
        }


      </>
    )
  }
}
export default ImageUpload
import React from 'react'
import { getPortfolio, respondOffer, finishTrade } from '../../lib/api'
import ProfileCard from '../common/ProfileCard'
import { Link } from 'react-router-dom'
import Chat from '../common/Chat'


class ProfilePage extends React.Component {

  state = {
    user: null,
    offerData: {
      offer: '',
      response: '',
      text: '',
      userName: '',
      plantName: '',
      plantId: '',
      userId: '',
      isMessage: false
    },
    id: '',
    isResponse: false,
    timeMessage: ''
  }
  // THis function just get all the user portfolio
  async componentDidMount() {
    try {
      const res = await getPortfolio()
      this.timeOfDay()
      this.setState({ user: res.data })
    } catch (err) {
      console.log(err)
    }
  }

  handleChange = event => {
    const offerData = { ...this.state.offerData, [event.target.name]: event.target.value }
    this.setState({ offerData })
    console.log(event.target.name)
  }

  handleSubmit = async (event, id, plantId, offeredPlantId) => {
    event.preventDefault()
    try {
      const res = await respondOffer(id, plantId, 'Accepted', offeredPlantId, this.state.offerData)
      this.setState({ offerData: res.data })
      this.clicker()
    } catch (err) {
      console.log(err)
    }
  }

  handleSubmitDecline = async (event, id, plantId, offeredPlantId) => {
    event.preventDefault()
    try {
      const res = await respondOffer(id, plantId, 'Declined', offeredPlantId, this.state.offerData)
      this.setState({ offerData: res.data })
      this.clicker()
    } catch (err) {
      console.log(err)
    }
  }

  finishTrade = async (userid, offerid, plantid, userplantid) => {
    try {
      await finishTrade(userid, offerid, plantid, userplantid)
      window.location.reload()
    } catch (err) {
      this.props.history.push('/notfound')
    }
  }

  //  This function toggle Respond on Offer button
  clicker = () => {
    this.setState({ isResponse: this.state.isResponse === false ? true : false })
  }
  // Changing classes, depends on declined or accepted offer
  decisionClass = decision => {
    if (decision === 'Accepted') {
      return 'button is-accept is-fullwidth'
    }
    else {
      return 'button is-decline is-fullwidth'
    }
  }

  // Responses on your offers function
  handleResponse = () => {

    return this.state.user.submittedOffers.map(offer => {
      let accepted = false
      if (offer.response === 'Accepted') {
        accepted = true
      }
      return <div className="offer-section">
        <div className="title is-4">You have a response from: <Link to={`/profile/${offer.userId}`}> {offer.userName}</Link> </div>
        <div className="offer-container">
        <div className="offer">
          On plant: <br/><Link to={`/plants/${offer.plantId}`}> {offer.plantName}<br />
          <img src={offer.plantImageUrl} alt={offer.plantName} className='image  image-offer is-64x64'/>
        </Link>
        </div>
        <span className="arrow">	&hArr;</span>
        <div className="offer">
          You are offering:  <br/> <Link to={`/plants/${offer.offeredPlantId}`}>{offer.offeredPlantName}<br />
          <img src={offer.offeredImageUrl} alt={offer.offeredPlantName} className='image image-offer is-64x64' />
        </Link>
        </div>
        </div>
        <div className="field">
          <div className={this.decisionClass(offer.response)}>{offer.response}</div>
        </div>
        <div className="field">
                  </div>
                
                  Message from user: < br />
                    <div className="message">{offer.text}</div>
                    {accepted &&
                  <button type="submit" className="button is-dark"
                  onClick={() => {
                    this.finishTrade(this.state.user._id, offer._id, offer.offeredPlantId, offer.plantId)
                  }}
                  >
                    Trade with {offer.userName} finished
                  </button>
                  }
      </div>
    })

  }


  //  This function will show user received offers
  showRecievedOffers = () => {
    // array of  plants which contains offers
    const offerArray = this.state.user.createdPlants.filter(plant => {
      if (plant.offers.length > 0) {
        return plant
      }
      return null
    })
    let offerCounter = 0
    //  maping all the plants with offers
    return offerArray.map(plant => {
      // * accesing offers
      return plant.offers.map(offer => {

        if (this.state.user.email === offer.user.email) return null

        offerCounter++
        return <div key={offer._id} className="offer-section">
          {/* //* Offers on your plants Code  */}
          <div className='title is-4'>
            You have offer from: <Link to={`/profile/${offer.user._id}`}> {offer.user.name}</Link>
            </div>
            <div className="offer-container">
              <div className="offer">
            On plant: <Link to={`/plants/${plant._id}`}> {plant.name}
              <img src={plant.imageUrl} alt={plant.name} className="image is-64x64" />
            </Link>
            </div>
            <span className="arrow">	&hArr;</span>
            <div className="offer">
            Offered Plant: <Link to={`/plants/${offer.plantId}`}>{offer.name}
              <img src={offer.imageUrl} alt={offer.name} className="image is-64x64"/>
            </Link>
            </div>
            </div>
            <p>Message from {offer.user.name}: </p>
            <div className="message">{offer.text} </div>

            {/* <img src={offer.imageUrl} /> */}

          <button
            className="button is-dark"
            onClick={this.clicker}>Respond to the offer
            </button>
          {this.state.isResponse &&
            <>
              <form onSubmit={this.handleSubmit} className="column is-half is-offset-one-quarter box">

                <div className="field">
                  <label className="label">Message to {offer.user.name}: </label>
                  <div className="control">
                    <textarea className="input"
                      placeholder="Message"
                      name="text"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <button type="submit" className="button is-accept"
                    onClick={(event) => {
                      this.handleSubmit(event, offer.user._id, plant._id, offer.plantId)
                    }}
                  >Accept</button>

                  <button type="submit" className="button is-decline"
                    onClick={(event) => {
                      this.handleSubmitDecline(event, offer.user._id, plant._id, offer.plantId)
                    }}
                  >Decline</button>
                </div>
              </form>
              <hr />
            </>
          }
        </div>
      })
    })
  }

  timeOfDay = () => {
    const date = new Date()
    const hour = date.getHours()
    let message = ''
    console.log('hour: ', hour)
    if (hour < 12){
      message = 'Good Morning'
    } else if (hour >= 12 && hour < 17){
      message = 'Good Afternoon'
    } else {
      message = 'Good Evening'
    }
    this.setState({ timeMessage: message })
  }

  render() {
    if (!this.state.user) return null
    // console.log(this.state.user)

    return (
      <section className="section m-scene">
        <h1 className="title is-2 has-text-centered">{`${this.state.timeMessage} ${this.state.user.name}`}</h1>
            <hr />
         <div className='offers-container'>

{/* Received offers jsx code in that function */}
<div className='offers'>
  <h1 className="title is-4 is-sucess">Your Offers: </h1>
  <hr />
  {this.showRecievedOffers()}
</div>

{/* Responses for your offers */}
<div className='responses'>
  <h1 className="title is-4 is-sucess">Your responses: </h1>
  <hr />
  {this.handleResponse()}
</div>
</div>
        <div className="container">
          <div>
            <h2 className="title is-4 has-text-centered">You have {this.state.user.createdPlants.length} plants in your portfolio</h2>
          </div>
          <br />
          <div className="columns is-multiline scene_element scene_element--fadein">
            {this.state.user.createdPlants.map(plant => (
              <ProfileCard key={plant._id} {...plant} />
            ))}
          </div>
        </div>
        <div>
         
        </div>

      </section>
    )
  }

}
export default ProfilePage
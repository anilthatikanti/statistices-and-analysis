// Write your code here

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    last7daysVaccination: [],
    vaccinationByAge: [],
    vaccinationByGender: [],
    status: apiStatus.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({status: apiStatus.inProgress})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok === true) {
      const last7daysVaccination = data.last_7_days_vaccination.map(each => ({
        vaccinationDate: each.vaccine_date,
        dose1: each.dose_1,
        dose2: each.dose_2,
      }))
      const vaccinationByAge = data.vaccination_by_age.map(each => ({
        age: each.age,
        count: each.count,
      }))
      const vaccinationByGender = data.vaccination_by_gender.map(each => ({
        count: each.count,
        gender: each.gender,
      }))

      this.setState({
        last7daysVaccination,
        vaccinationByAge,
        vaccinationByGender,
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  Failure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png "
        alt="failure view"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  Loading = () => (
    <div testid="loader" className="loadingContainer">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  getResult = () => {
    const {
      last7daysVaccination,
      vaccinationByAge,
      vaccinationByGender,
    } = this.state

    return (
      <div className="container">
        <div className="iconContainer">
          <img
            className="websiteLogo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png "
            alt="website logo"
          />
          <h1 className="mainHeading">co-Win</h1>
        </div>
        <h1 className="mainPagePara">CoWIN Vaccination in India</h1>
        <VaccinationCoverage last7daysVaccination={last7daysVaccination} />
        <VaccinationByGender vaccinationByGender={vaccinationByGender} />
        <VaccinationByAge vaccinationByAge={vaccinationByAge} />
      </div>
    )
  }

  apiStatusProgress = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.inProgress:
        return this.Loading()
      case apiStatus.success:
        return this.getResult()
      case apiStatus.failure:
        return this.Failure()
      default:
        return null
    }
  }

  render() {
    return <div>{this.apiStatusProgress()}</div>
  }
}
export default CowinDashboard

import React, { Component } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'

// the assumption can be made that

export default class UserComponent extends Component {

    constructor(props){
        super(props)

        // this.onChangeDate = this.onChangeDate.bind(this)
        // this.onChangeDescription = this.onChangeDescription.bind(this)
        // this.onChangeDuration = this.onChangeDuration.bind(this)
        // this.onChangeUsername = this.onChangeUsername.bind(this)
        // this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            nickname: '',
            user_id: '',
            email: '',
            date: new Date(),
            // after initial testing, retreive and include MGDB user specific information in state
        }
    }


    componentDidMount() {
        // what we are doing here: getting pre-existing user information via axios,
        axios.get('http://localhost:3000/user/')
            .then( (response) => {
                if (response.data.length >0){
                    this.setState({
                        nickname: response.data.nickname,
                        user_id: response.data.user_id,
                        email: response.data.displayName,
                        date: new Date(),

                    })
                }
            })
    }
// add links

    render(){
        return(
            <div className="container">
                <div className="row" >
                    <div className="col-4">
                        <h3>Your User Profile</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        // display user state information
                        // maybe use a bootstrap card?
                        <span>nickname:<h5>{this.state.nickname}</h5></span>
                        <span>user_id:<h5>{this.state.user_id}</h5></span>
                        <span>email:<h5>{this.state.email}</h5></span>
                        <span>date:<h5>{this.state.date}</h5></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        // buttons that link to edit profile, view all other users (maybe a leaderboard),
                        {/*<Link to="/updateprofile/">*/}
                        {/*    <button type="button" className="btn btn-primary">Edit Profile</button>*/}
                        {/*</Link>*/}
                        <Link to="/viewstudents/">
                            <button type="button" className="btn btn-primary">View All Users</button>
                        </Link>

                        {/*<button type="button" className="btn btn-danger">Delete Profile</button>*/}

                    </div>
                </div>
            </div>
        )
    }
}
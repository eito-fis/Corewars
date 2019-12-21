import React, { Component } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'

// the assumption can be made that

export default class UserComponent extends Component {

    constructor(props){
        super(props)

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

    render(){
        return(
            <div className="container">
                <div className="row" >
                    <div className="col-6">
                        <h1>Welcome, {this.state.nickname}, to the Corewars.tech webapp beta!</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        {/*// display top warrior with a link to click via a bootstrap card via MGDB user information*/}
                        <h3>Thanks for checking us out!</h3>
                        <h5>If this is your first time on our webapp, please verify your user ID with the verify button below!</h5>
                        <h5>Otherwise, please ignore the 'Verify' Button. </h5>
                        <Link to="/user/createnewusersecured/">
                            <button type="button" className="btn btn-success">Verify!</button>
                        </Link>
                        <br />
                        <h5>View & edit  your user profile and check out the leaderboard below!</h5>
                        <Link to="/user/">
                            <button type="button" className="btn btn-primary">User Info</button>
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        {/*// button that links to Play*/}

                        <h3>Play the Game here!</h3>
                        <Link to="/play/">
                            <button type="button" className="btn btn-primary">View All Users</button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}
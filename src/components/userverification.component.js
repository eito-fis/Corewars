// this is a component solely for user verification if the user has not been created already.
import React, { Component } from 'react';
import axios from 'axios'




export default class UserVerificationComponent extends Component {
    constructor(props){
        super(props)

        this.onChangeNickname = this.onChangeNickname.bind(this)
        this.onSubmit = this.onSubmit.bind(this)


        this.state = {
            nickname: '',
            user_id: '',
            email: '',
            date: new Date(),

        }
    }

    componentDidMount() {
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

    onChangeNickname(e){
        this.setState({nickname: e.target.value})
    }


    onSubmit(e){

        e.preventDefault()

        axios.post('http://localhost:3000/exercises/createnewusersecured')
            .then(res=> console.log(res.data))
        // this should redirect to the 'home page'
        window.location.href = '/'
    }



    render(){

        return(
            <div className="container">
                <div className="row">
                    <div className="col-sm-4">
                        <h3>Click the Verify button on the right & ensure the values in the entry fields are OK, only if this is your first time on the platform and you haven't clicked it before, to create a new user profile for yourself. </h3>
                    </div>
                    <div className="col-sm-8">
                        // this section contains the form inputs, the submit button, etc.

                        <form onSubmit={this.onSubmit}>
                            <div className='form-group'>
                                <label>Alter my Username:</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={this.state.nickname}
                                    onChange={this.onChangeNickname}
                                />
                            </div>
                            <div className="form-group">
                                <input type="submit" value="Verify" className="btn btn-primary" />
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        )
    }
}

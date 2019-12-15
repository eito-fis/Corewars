//React navbar component

import React, {Component} from "react"
import { Link } from 'react-router-dom'


export default class Navbar extends Component {
    render(){
        return(
            <nav className='navbar navbar-dark bg-dark navbar-expand-lg' >
                <Link to="/" className="navbar-brand">CoreWars.tech</Link>
                <div className="collpase navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="navbar-item">
                            <Link to="/play" className="nav-link">Play!</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/user" className="nav-link">viewProfile</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/login" className="nav-link">Login/Logout</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}
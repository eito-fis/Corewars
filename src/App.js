import React from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
// components
import Navbar from "./components/navbar.component";
//import indexComponent from "components/index.component"
//import userComponent from "components/user.component"
import playComponent from "./components/play.component"

function App() {
  return (
      <Router>
        <div className='container' >
          {/*
          <Navbar />
          <br />
              <Route path="/" exact component={indexComponent} />
              <Route path="/user" component={userComponent} />
          */} 
          <Route path="/play" component={playComponent} />
        </div>
      </Router>

  );
}

export default App;

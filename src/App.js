import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
// importing components, grouped
import Navbar from "../components/navbar.component";
import indexComponent from "../components/index.component"

import userComponent from "../components/user.component"
import UserVerificationComponent from "../components/userverification.component"

import playComponent from "../components/play.component"
import playEditComponent from "../components/playedit.component"
import playNewComponent from "../components/playnew.component"

function App() {
  return (
      <Router>
        <div className='container' >
            <Navbar />
            // Routing Setup
            <Route path="/" exact component={indexComponent} />
            <Route path="/play" component={playComponent} />
            <Route path="/user" component={userComponent} />
            <Route path="/user/createnewusersecured" component={UserVerificationComponent} />
            <Route path="/play/edit" component={playEditComponent} />
            <Route path="/play/new" component={playNewComponent} />>
        </div>
      </Router>

  );
}

export default App;

import React, { Component } from 'react';
import './App.css';
import Habits from './Habits.js'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      user: null,
      entries: [],
    }
    this.setUserAndFetchPosts = this.setUserAndFetchPosts.bind(this);
    document.title = "Habits";
  }

  fetchPostsById = (id) => {
    const API = 'https://vast-wildwood-04655.herokuapp.com/getPostsByUserId/' + (id ? id : '');
    fetch(API)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ entries: data })
      })
      .catch(console.log);

  }

  componentDidMount() {
    this.fetchPostsById(this.state.user ? this.state.user.userId : null);
  }

  createAccount = () => {
    if (this.state.username != null && this.state.password != null) {
      fetch('https://vast-wildwood-04655.herokuapp.com/addUser', {
        method: 'POST',
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then(response => {
        alert("account created")
        console.log(response);
      });
    } else {
      alert("incomplete accont info")
    }
  }

  render() {
    return (
      <div>
        <input placeholder="username" type="text" onChange={evt => this.updateInputValue(evt)}></input>
        <input placeholder="password" type="text" onChange={evt => this.updatePassValue(evt)}></input>
        <button onClick={this.setUserAndFetchPosts}>Login</button>
        <button onClick={this.createAccount}>Create Account</button>
        <br />
        <button onClick={this.setUserAndFetchPosts}>Refresh</button>
        <Habits entries={this.state.entries} user={this.state.user} />
      </div>
    );
  }

  updateInputValue(evt) {
    this.setState({
      username: evt.target.value
    });
    console.log(evt.target.value);
  }

  updatePassValue(evt) {
    this.setState({
      password: evt.target.value
    });

  }

  setUserAndFetchPosts() {
    const name = this.state.username;
    const API = 'https://vast-wildwood-04655.herokuapp.com/getUserByUsername/' + (name ? name : '');
    fetch(API)
      .then(res => res.json())
      .then(data => {
        this.setState({ user: data })
        if (data.password == this.state.password) {
          alert("Posts Updated");
          this.fetchPostsById(this.state.user.userId)
        } else {
          alert("wrong credentials")
        }
      })
      .catch(console.log);
  }

}

export default App;

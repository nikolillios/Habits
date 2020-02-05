import React from 'react';

export default class Habits extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      frequency: 7,
      newEntries: [],
      updatable: true,
    }
    this.post = this.post.bind(this);
    this.complete = this.complete.bind(this);
  }

  updateEntry = (evt) => {
    this.setState({ 'content': evt.target.value });
  }

  post() {
    fetch('https://vast-wildwood-04655.herokuapp.com/addPost', {
      method: 'POST',
      body: JSON.stringify({
        userId: this.props.user.userId,
        content: this.state.content,
        frequency: this.state.frequency,
        score: 1
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(response => {
      this.setState({
        newEntries: this.state.newEntries.concat([{
          userId: this.props.user.userId,
          content: this.state.content,
          frequency: this.state.frequency,
          score: 1
        }])
      })
      console.log(response);
    });
  }

  updateFreq(evt) {
    this.setState({ frequency: evt.target.value });
  }

  complete(post) {
    let del = post.score == 0 ? 0 : 1 / post.frequency;
    this.updateScore(post, del);
    alert("habit completed, refresh to see updated score")
  }

  updateScores = () => {
    for (var i = 0; i < this.props.entries.length; i++) {
      let entry = this.props.entries[i];
      let del = entry.score - (1 / 7) >= 0 ? -1 * (1 / 7) :
        entry.score * -1;
      this.updateScore(entry, del);
    }
    for (var i = 0; i < this.state.newEntries.length; i++) {
      let entry = this.state.newEntries[i];
      let del = entry.score - (1 / 7) >= 0 ? -1 * (1 / 7) :
        entry.score * -1;
      this.updateScore(entry, del);
    }
    this.setState({ updatable: false });
    alert("refresh to see update scores")
  }

  updateScore(post, del) {
    fetch('https://vast-wildwood-04655.herokuapp.com/addPost', {
      method: 'POST',
      body: JSON.stringify({
        postId: post.postId,
        userId: post.userId,
        content: post.content,
        frequency: post.frequency,
        score: (post.score + del)
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(response => {
      console.log(response);
    });
  }

  render() {
    return (
      <div>
        <h1 className="diarytag">{this.props.user ? this.props.user.username + "'s habits" : "Please Login"}</h1>
        <button disabled={!this.state.updatable} onClick={this.updateScores}>Click here at end of day to update habit scores</button>
        <br />
        <textarea rows="5" cols="60" onChange={this.updateEntry} placeholder="Enter your new habit here">
        </textarea>
        <br />
        <h3>How many days a week?</h3>
        <input defaultValue="7" type="text" onChange={evt => this.updateFreq(evt)}></input>
        <button onClick={this.post}>Add new habit <br /></button>
        <h3>My Habits</h3>
        {this.state.newEntries.map(element => {
          return (
            <div>
              <p>{element.content} : {element.frequency} days per week</p>
              <p>Score: {element.score}</p>
              <p>New Habit Created!</p>
            </div>
          );
        })}

        {this.props.entries.map(element => {
          return (
            <div>
              <p>{element.content} : {element.frequency} days per week</p>
              <p>Score:  {element.score == 0 ? "Failed" : element.score}</p>
              <button onClick={() => this.complete(element)}>Completed today</button>
            </div>
          );
        })}
      </div>
    )
  }
}
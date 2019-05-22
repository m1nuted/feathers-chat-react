import React, { Component } from 'react';
import moment from 'moment';
import client from './feathers';


//TODO  => the aside section when a message is too long shrinks in a bad way. Need to be fixed.


class Chat extends Component {

    constructor(props){

        super(props);
        this.state = {
            text: 0
        }
    }

    sendMessage(ev) {

    const input = ev.target.querySelector('[name="text"]');
    let text = input.value.trim();

    text.includes("/kick") ? text = this.kickUser(text) : null;

    var texts = text.replace(/\//gi, "/,").split(",");

    texts[0] == "/" ? this.specialCommand(text) : null


    console.log(texts);

    if(text) {
      client.service('messages').create({ text }).then(() => {
        input.value = '';
      });
    }
    ev.preventDefault();
    }

    specialcommand(command){

    }

    kickUser(text){

      const {users} = this.props;

      let texts = text.split(" ");
      let user = texts[1]

      let listOfUsers = [];

      users.forEach(u => {
          listOfUsers.push(u.email)
      })

      let message = ""


      texts.length !== 2 ? message = "incorrect number of parameters" : listOfUsers.includes(user) ? message = "Attempting to kick " + user + "..." : message = "There's no such user";

      return message
    }

    scrollToBottom() {
    const chat = this.chat;
    chat.scrollIntoView(false)
    }

    componentDidMount() {
    this.scrollToBottom = this.scrollToBottom.bind(this);

    client.service('messages').on('created', this.scrollToBottom);
    this.scrollToBottom();
    }

    componentWillUnmount() {
        // Clean up listeners
    client.service('messages').removeListener('created', this.scrollToBottom);
    }

    userDetail(user){
      alert("you clicked on " + user.email + " from " + user.location);
    }


    render() {

    const { users, messages } = this.props;

    return <main>
      <header>
          <img className="logo" src="./logo.jpg" alt="Feathers Logo" style={{minWidth:"150px", width:"20%"}} />
              <a href="#" onClick={() => client.logout()} className="button button-primary">
                  Sign Out
              </a>
      </header>

        <aside>
            <div className="asideHeader">
                <h4>
                    <span>{users.length}</span> users
                </h4>
            </div>

            <div className="userList">
                <ul>
                    {users.map(user => <li key={user._id}>
                        <a className="block relative" href="#">
                            <span className="username" onClick={(()=>this.userDetail(user))}>{user.email}</span>
                        </a>
                    </li>)}
                    </ul>
            </div>
        </aside>

        <div className="content" >
          <div className="main" ref={main => { this.chat = main; }}>
            {messages.map(message => <div key={message._id} className="message">
              <img src={message.user.avatar} alt={message.user.email} className="avatar" />
              <div className="message-wrapper">
                <p className="message-header">
                  <span className="username">{message.user.email} </span>
                  <span className="sent-date">{moment(message.createdAt).format('MMM Do, hh:mm:ss')}</span>
                </p>
                <p className="message-content">{message.text}</p>
              </div>
            </div>)}
          </div>
        </div>


          <footer>
              <form onSubmit={this.sendMessage.bind(this)} id="send-message">
                  <input type="text" name="text" maxLength="100"/>
                  <button className="button-primary" type="submit">Send</button>
              </form>
          </footer>
    </main>;
  }
}

export default Chat;

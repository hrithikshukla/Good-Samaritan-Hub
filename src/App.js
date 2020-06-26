import React, { Component } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import "./App.css";
import TopBar from "./components/TopBar";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Registration from "./components/Registration";
import UserView from "./components/UserView";
import AdminLogin from "./components/AdminLogin";
import AdminHome from "./components/AdminHome";

import { getInitialUsers, getInitialPosts } from './data/hardCodedData';

class App extends Component {
  // Global theme
  theme = createMuiTheme({
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Muli"',
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
    palette: {
      primary: {
        light: '#4f5b62',
        main: '#263238',
        dark: '#000a12',
        contrastText: '#fff',
      }
    }
  });

  // Initial global state
  state = {
    user: getInitialUsers()[0], // TODO: Init to {}/undefined and change this based on which user is logged in
    users: getInitialUsers(), // Phase 2: Initialize users to an empty list
    posts: getInitialPosts() // Phase 2: Initialize posts to an empty list
  };

  onComponentDidMount() {
    this.requestReload();
  }

  requestReload = () => {
    // Phase 2: Get the list of users and posts from the server and set this component's state
    // this.setState({
    //   users: server call to get users
    //   posts: server call to get posts
    // });
  }

  handleLogout = () => {
    this.setState({ user: {} });
  }

  render() {
    const { user, users, posts } = this.state;

    return (
      <React.Fragment>
        <ThemeProvider theme={this.theme}>
          <BrowserRouter>
            <Switch>
              {/* Shows a different component depending on the exact path in the URL */}

              <Route
                exact
                path={["/home", "/profile", "/inbox"]}
                render={() => 
                  <UserView
                    appComponent={this}
                    user={user}
                    users={users}
                    posts={posts}
                    handleLogout={this.handleLogout}
                  />
                }
              />
              <Route
                exact
                path="/admin/home"
                render={() => 
                <AdminHome 
                  users={users} 
                  posts={posts}
                />}
              />

              {/* The pages in this fragment share the same top bar */}
              <React.Fragment>
                <TopBar />
                <Route exact path="/" render={() => <Landing />} />
                <Route
                  exact
                  path="/login"
                  render={() => <Login title="User Login" />}
                />
                <Route
                  exact
                  path="/registration"
                  render={() => <Registration />}
                />
                <Route exact path="/admin" render={() => <AdminLogin />} />
              </React.Fragment>
            </Switch>
          </BrowserRouter>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default App;

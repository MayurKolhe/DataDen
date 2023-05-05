import React, { Component } from "react";
import { Link } from "react-router-dom";
import Identicon from "identicon.js";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

const logo = {
  fontSize: "45px",
  textAlign: "center"
}

const cloudLogo = {
    width: "40px",
    padding: "2px",
    backgroundColor: "white",
    borderRadius: "28%",
    marginBottom: "6px",
    marginRight: "12px"
}

class TopNavbar extends Component {
  
  render() {
    return (
      <>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/" style={logo}>
              <img style={cloudLogo} src="cloud-check-fill.svg" alt=""></img>
              DataDen App
            </Navbar.Brand>
            <div className="ms-auto d-flex align-items-center text-light">
              {this.props.account && (
                <Link to="/">
                  <img
                    className="ml-2"
                    width="30"
                    style={{ borderRadius: 20 }}
                    height="30"
                    alt="logo"
                    src={`data:image/png;base64,${new Identicon(
                      this.props.account,
                      30
                    ).toString()}`}
                  />
                </Link>
              )}
            </div>
            
          </Container>
        </Navbar>
      </>
    );
  }
}

export default TopNavbar;

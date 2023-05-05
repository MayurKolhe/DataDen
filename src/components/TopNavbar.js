import React, { Component } from "react";
import { Link } from "react-router-dom";
import Identicon from "identicon.js";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

class TopNavbar extends Component {
  render() {
    return (
      <>
        <Navbar bg="primary" variant="dark">
          <Container>
            <Navbar.Brand href="/">
              <img
                alt=""
                src=""
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              DataDen App
            </Navbar.Brand>
            <div className="ms-auto d-flex align-items-center text-light">
              <Link to="/uploadfiles" className="btn btn-outline-light mr-2">
              <i className="bi bi-cloud-plus"></i>
              </Link>
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

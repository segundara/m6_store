import React from 'react';
import { Navbar, Nav, Badge } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import "./Style.css"

class NavBar extends React.Component {
    state = {

    }

    render() {

        return (
            <Navbar collapseOnSelect expand="lg">
                <Link to="/">
                    <Navbar.Brand>Strive-Mazon</Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className='d-flex justify-content-between'>
                    <Nav className="mr-auto">
                        <Link to="/backoffice"
                            className={
                                this.props.location.pathname === '/backoffice'
                                    ? "nav-link active shadow-lg border-bottom"
                                    : "nav-link"
                            }
                        >
                            Backoffice
                        </Link>
                    </Nav>

                    {this.props.location.pathname === '/backoffice'
                        ? null
                        : (
                            <span className='d-flex'>
                                <FontAwesomeIcon icon={faCartPlus} className="mt-3" onClick={() => this.props.history.push("/checkout")} />
                                <Badge className='align-self-start' variant="info">{this.props.updateProductInCart ? this.props.updateProductInCart : 0}</Badge>
                            </span>
                        )
                    }
                </Navbar.Collapse>
            </Navbar>
        )
    }
}


export default withRouter(NavBar);
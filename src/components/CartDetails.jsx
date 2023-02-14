import React from "react";
import { Button, Table, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

class CartDetails extends React.Component {
  state = {
    cartTotal: 0,
    cartItems: [],
  };

  makePayment = () => {
    this.props.paymentTotal(this.state.cartTotal)
    this.props.history.push("/payments")
  };

  removeFromCart = async (productID, productQuantity) => {
    const url = `${process.env.REACT_APP_API_URL}/cart/1/${productID}`;
    if (productQuantity > 1) {
      const resp = await fetch(url, {
        method: "DELETE",
      });
      if (resp.ok) {
        this.showCartDetails()
      }
    }
    else {
      const resp = await fetch(url, {
        method: "DELETE",
      });
      if (resp.ok) {
        this.showCartDetails()
        this.props.reduceCartNumber(productID);
      }
    }

  }

  showCartDetails = async () => {
    const url = `${process.env.REACT_APP_API_URL}/cart/1`;
    const resp = await fetch(url);
    if (resp.ok) {
      const products = await resp.json();
      if (products.length > 0) {
        const totalArray = products.map((item) => parseFloat(item.total));
        let totalAmount = totalArray.reduce((acc, curr) => {
          return acc + curr;
        });
        this.setState({
          cartItems: products,
          cartTotal: totalAmount,
        });
        console.log(totalArray);
      }
      else {
        this.setState({
          cartItems: [],
          cartTotal: 0,
        });
      }
    }
  }

  componentDidMount = () => {
    this.showCartDetails()
  };

  render() {
    console.log(this.state.cartItems);
    return (
      <Container>
        <div className="text-center mt-5">
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>name</th>
                <th>unit price</th>
                <th>quantity</th>
                <th>total price</th>
              </tr>
            </thead>
            <tbody>
              {this.state.cartItems.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.unitary_price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.total}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => this.removeFromCart(item._id, item.quantity)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <br />
          <Table bordered size="sm" variant="secondary">
            <thead>
              <tr>
                <th>Overall Total</th>
                <th>€{this.state.cartTotal}</th>
              </tr>
            </thead>
          </Table>
          <div className="d-flex justify-content-between">
            <Button variant="info" onClick={() => this.props.history.push("/")}>
              Continue shopping
            </Button>
            <Button variant="success" onClick={() => this.makePayment()}>
              Proceed to Payment
            </Button>
          </div>
        </div>
      </Container>
    );
  }
}

export default CartDetails;
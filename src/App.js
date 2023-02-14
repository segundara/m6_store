import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/TopNav";
import Details from "./components/Details";
import Backoffice from "./components/Backoffice";
import Products from "./components/Products";
import Stripe from "./components/StripeContainer";
import CartDetails from "./components/CartDetails";

class App extends React.Component {
  state = {
    count: 0,
    productidArray: [],
    paymentTotal: 0
  };

  addToCart = async (productid, userid) => {
    if (!this.state.productidArray.includes(productid)) {
      const idArray = [...this.state.productidArray, productid];
      this.setState({ productidArray: idArray, count: this.state.count + 1 });
    } else {
      this.setState({ count: this.state.count });
    }
  };

  reduceCartNumber = (productid) => {
    const idArray = this.state.productidArray.filter(id => id !== productid);
    this.setState({ productidArray: idArray, count: this.state.count - 1 });
  };

  emptyCart = (value) => {
    this.setState({ count: value });
  };

  setPayment = (value) => {
    this.setState({ paymentTotal: value });
  };

  render() {
    console.log(this.state.productidArray);
    console.log(this.state.count);
    return (
      <Router>
        <Navbar updateProductInCart={this.state.count} />
        <Route
          // path={process.env.REACT_APP_HOMEPAGE}
          path="/"
          exact
          render={(props) => (
            <Products {...props} sendCartUpdate={this.addToCart} />
          )}
        />
        <Route path="/productDetails/:id" component={Details} />
        <Route path="/payments"
          render={(props) => <Stripe {...props} paymentTotal={this.state.paymentTotal} emptyCart={this.emptyCart} />} />
        <Route
          path="/checkout"
          render={(props) => <CartDetails {...props} paymentTotal={this.setPayment} reduceCartNumber={this.reduceCartNumber} />}
        />
        <Route path="/backoffice" component={Backoffice} />
      </Router>
    );
  }
}

export default App;
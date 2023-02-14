import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";
import {withRouter} from "react-router-dom"

const PUBLIC_KEY =
  "pk_test_51HiMfGF0BTR6mhRYaP0W68izWmkcFUYNqvzshZIwb8d3MyAuViC8HFmP8WU4TQEOBsjlAqLn9tOr5RacYxeit67q00iqLQn6QY";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const Stripe = ({paymentTotal, emptyCart}) => {
  return (
    <Elements stripe={stripeTestPromise}>
      <CheckoutForm paymentTotal={paymentTotal} emptyCart={emptyCart}/>
    </Elements>
  );
};

export default withRouter(Stripe);
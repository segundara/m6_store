import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { withRouter } from "react-router-dom"
import "./Style.css"

const CheckoutForm = (props) => {
  console.log(props.history)
  const [done, setDone] = useState(false)
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      console.log("Stripe 23 | token generated!", paymentMethod);
      //send token with payment details to backend
      try {
        const { id } = paymentMethod;
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/cart/stripe/charge`,
          {
            amount: props.paymentTotal,
            id: id,
          }
        );

        console.log("Stripe 35 | data", response.data.success);
        if (response.data.success) {
          console.log("CheckoutForm.js 25 | payment successful!");
          const url = `${process.env.REACT_APP_API_URL}/cart/1`;
          const resp = await fetch(url, {
            method: "DELETE",
          });

          if (resp.ok) {
            props.emptyCart(0);
            setDone(true)
            setTimeout(() => {
              setDone(false)
              props.history.push(`${process.env.REACT_APP_HOMEPAGE}`)
            }, 5000);
          }
        }
      } catch (error) {
        console.log("CheckoutForm.js 28 | ", error);
      }
    } else {
      console.log(error.message);
    }
  };

  return (
    <Container className="text-center pt-3">
      <div style={{ maxWidth: '50%', margin: 'auto' }}>
        <h4>Enter your card details to complete the payment</h4>
        <Alert variant="info">
          <strong>Total Purchase (€{props.paymentTotal})</strong>
        </Alert>
        <Form onSubmit={handleSubmit} style={{ maxWidth: '75%', display: 'flex', margin: 'auto', flexDirection: 'column' }}>
          <CardElement className="my-5" />
          <button id="payBtn">Pay Now</button>
        </Form>
        <Alert variant="info" show={done} className="mt-3">
          <strong>
            Payment accepted and your goods are on the way! Thank you for your purchase and hope to see you again!
      </strong>
        </Alert>
      </div>
    </Container>
  );
};

export default withRouter(CheckoutForm);
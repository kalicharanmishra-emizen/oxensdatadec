import React, { useEffect, useState } from "react";
import styles from "../../styles/checkoutform.module.css";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const Checkoutform = (props) => {

    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      if (!stripe) {
        return;
      }
  
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }
  
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      });
    }, [stripe]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("checkout form called click on pay now button");
      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
  
      setIsLoading(true);
  
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: "http://localhost:3042",
        },
        redirect: 'if_required' 
      });
      console.log("stripe form error error", error);
  
      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message);
        } else {
          setMessage("An unexpected error occurred.");
        }
        setIsLoading(false);
        return false
      }
     
      // alert("called")
      setIsLoading(false);

      console.log("stripe form handel submit called",stripe);
      console.log("userData", props.userData.userData.email);
      props.paymentConfirm()
    };
  
    const paymentElementOptions = {
      layout: "tabs",
      defaultValues:{
        billingDetails:{
          name:props.userData.userData.name,
          email:props.userData.userData.email
        }
      },
      // fields: {
      //   billingDetails:{
      //       address:{
      //         country:"auto"
      //       }
      //     }
      // }
    }

  return (
    <form className={styles.paymentForm} id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button className={styles.paymentFormButton} disabled={isLoading || !stripe || !elements} id="submit">
            <span id="button-text" >
                {isLoading ? <div className={styles.spinner} id="spinner"></div> : "Pay now"}
            </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
    </form>
  )
}

export default Checkoutform
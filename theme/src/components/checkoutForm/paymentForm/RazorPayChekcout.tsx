import React, { FC, useEffect } from "react"

let scriptAdded = false

interface Props {
  formSettings
  shopSettings
  onPayment
}

const RazorPayButton: FC<Props> = props => {
  const { formSettings, shopSettings, onPayment } = props

  const addScript = () => {
    if (scriptAdded) {
      executeScript()
      return
    }

    const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js"
    const container = document.body || document.head
    const script = document.createElement("script")
    script.src = SCRIPT_URL
    script.onload = () => {
      executeScript()
    }
    container.appendChild(script)
    scriptAdded = true
  }

  const executeScript = () => {
    var options = {
        "key": "rzp_test_PjYfgXc9ucOLuC", // Enter the Key ID generated from the Dashboard
        "amount": "3", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Acme Corp",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": "order_LNOyN3z3SqhVmT", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            alert(response.razorpay_payment_id);
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature)
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9000090000"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);

    document.getElementById('razorpay-button-container').onclick =  (e)=> {
        rzp1.open();
        e.preventDefault();
      }
      rzp1.on('payment.failed', (response) => {
        alert(response.error.code);     
        alert(response.error.description);      
        alert(response.error.source);
        alert(response.error.step);     
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
  };

  useEffect(() => {
    addScript()
  }, [])

  useEffect(() => {
    executeScript()
  })

  return (
    <div>
      <div id="razorpay-button-container" />
    </div>
  )
}

export default RazorPayButton

import React, { FC, useEffect } from "react"

let scriptAdded = false

interface Props {
  formSettings
  shopSettings
  onPayment
}

const RazorPayButton: FC<Props> = props => {
  const { formSettings, shopSettings, onPayment } = props

  console.log(formSettings)
  console.log(shopSettings)
  console.log(onPayment)


  const addScript = () => {
    return new Promise((resolve, reject) => {
      if (scriptAdded) {
        resolve();
        return;
      }
  
      const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
      const container = document.body || document.head;
      const script = document.createElement("script");
      script.src = SCRIPT_URL;
      script.onload = () => {
        scriptAdded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error(`Failed to load script ${SCRIPT_URL}`));
      };
      container.appendChild(script);
    });
  };
  

  const executeScript = () => {
    const payload = JSON.stringify({
      orderId: formSettings.order_id,
      amount: formSettings.amount 
    });
    
    fetch('api/v1/create/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    })
      .then(response => response.json())
      .then(data => {
        console.log('API response:', data);
        return data.OrderId
      }).then((rzpOrderId)=>{
        var options = {
          "key": formSettings.client_id, // Enter the Key ID generated from the Dashboard
          "amount": formSettings.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          "currency": formSettings.currency,
          "name": shopSettings.store_name,
          "description":  formSettings.user_first_name+" payment for order "+formSettings.order_id,
          "image": "https://falcano.com/assets/images/logo.png",
          "order_id": rzpOrderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          "handler": function (response){
              alert(response.razorpay_payment_id);
              alert(response.razorpay_order_id);
              alert(response.razorpay_signature);
              console.log(response)
              verifyPayment({
                orderId: formSettings.order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
              onPayment()
          },
          "prefill": {
              "name": formSettings.user_first_name,
              "email": formSettings.email,
              "contact": formSettings.user_mobile
          },
          "notes": {
              "address": shopSettings.domain
          },
          "theme": {
              "color": "#3399cc"
          }
      };
      var rzp1 = Razorpay(options);
  
      document.getElementById('razorpay-button-container').onclick =  (e)=> {
          rzp1.open();
          e.preventDefault();
        }
  
        rzp1.on('payment.failed', (response) => {
          onPayment()
          alert(response.error.code);     
          alert(response.error.description);      
          alert(response.error.source);
          alert(response.error.step);     
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });
      })
      .catch(error => {
        console.error('Error calling API:', error);
      });
    
    
  };

  const verifyPayment=(data)=>{
    fetch('api/v1/verify/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log('API response:', data);
      })
      .catch(error => {
        console.error('Error calling API:', error);
      });
  }

  useEffect(() => {
    addScript().then(executeScript);
  }, []);
  
  return (
    <div>
      <button 
        id="razorpay-button-container" 
        style={{backgroundColor: '#f44336', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer'}}
      >
        pay
      </button>
    </div>
  )
}

export default RazorPayButton

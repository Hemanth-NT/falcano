import Razorpay from 'razorpay'
import OrdertTansactionsService from "../services/orders/orderTransactions"

const ID ="rzp_test_1rtxPMszKQGv26"
const SECRET= "9YHKcH5gZhGcbv8zxpXhk37E"

let rzp = new Razorpay({
  key_id: ID, 
  key_secret: SECRET
})

const getPaymentFormSettings = options => {
  const { gateway, gatewaySettings, order, amount, currency } = options
  let isProduction=true
  if (gatewaySettings.env === 'production') {
      isProduction=false
  }
    const formSettings = {
    order_id: order.id,
    amount,
    currency,
    email: order.email,
    public_key: gatewaySettings.client_id,
    user_mobile: order.mobile,
    user_first_name:order.first_name,
    user_last_name:order.last_name,
    customer_id:order.customer_id,
    client_id:gatewaySettings.client_id,
    is_production: isProduction

  }
  return Promise.resolve(formSettings)
}

const paymentNotification = async options => {
  const { gateway, gatewaySettings, ctx } = options
  const params = ctx.request.body
  const dataStr = Buffer.from(params.data, "base64").toString()
  const data = JSON.parse(dataStr)

  ctx.status = 200

  console.log(params)
  console.log(dataStr)
  console.log(data)
}

const createOrder= async (options)=>{
  console.log(options)
  let response={}
  try {
     response = await rzp.orders.create(options);

  } catch (error) {
    console.log(error)
  }
  return response;
}

const processOrderPayment = async ({ order, gatewaySettings, settings }) => {
  try {
    
     console.log(order)
     console.log(gatewaySettings)
     console.log(settings)
  } catch (error) {
    return false
  }
}


export default {
  getPaymentFormSettings,
  paymentNotification,
  createOrder,
  processOrderPayment
}

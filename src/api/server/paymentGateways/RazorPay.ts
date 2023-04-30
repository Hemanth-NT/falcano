import Razorpay from 'razorpay'
import OrdertTansactionsService from "../services/orders/orderTransactions"

const ID ="rzp_test_PjYfgXc9ucOLuC"
const SECRET= "gTkfd2mv8FagvHjM6gfHisLa"

let rzp = new Razorpay({
  key_id: ID, 
  key_secret: SECRET
})

const getPaymentFormSettings = options => {
  const { gateway, gatewaySettings, order, amount, currency } = options
  const formSettings = {
    order_id: order.id,
    amount,
    currency,
    email: order.email,
    public_key: gatewaySettings.public_key,
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



export default {
  getPaymentFormSettings,
  paymentNotification,
  createOrder,
}

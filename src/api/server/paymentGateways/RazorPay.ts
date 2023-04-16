import Razorpay from 'razorpay'

const ID ="rzp_test_PjYfgXc9ucOLuC"
const SECRET= "gTkfd2mv8FagvHjM6gfHisLa"

let rzp = new Razorpay({
  key_id: ID, 
  key_secret: SECRET
})

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

export default createOrder


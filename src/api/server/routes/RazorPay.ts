import Router, { Middleware } from "@koa/router"
import RazorPayService from "../services/razorpay/razorpayservice"
const fs = require('fs');



const router = new Router()

const createOrder: Middleware = async ctx => {
    console.log(ctx.request.body)
    // let payload=ctx.request.body
    // let orderId=payload.orderId
    // let amount=payload.amount
    let rps=new RazorPayService()
    let resp:any = await rps.createOrders(ctx.request.body)
    ctx.status=resp.respCode
    ctx.message=resp.msg
  }

  const test: Middleware = async ctx => {
    const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
    ctx.type = 'html';
    ctx.body = html;
    ctx.status=200
  }
  
  const verifyPayment: Middleware = async ctx =>{
    let rps=new RazorPayService()
    let resp= await rps.verifyPayment(ctx.request.body)
    if(resp.signatureIsValid){
      ctx.status=200
      ctx.message="signature verified successfully"
    }else{
      ctx.status=200
      ctx.message="signature verification failed"
    }
  }
router
  .post(
    "/v1/create/order",
    createOrder
  ).get("/v1/hemanth",test)
  .post("/v1/verify/payment",verifyPayment)

export default router
import OrdersService from "../orders/orders"
import parse from "../../lib/parse"
import createOrder from "../../paymentGateways/RazorPay"
import * as crypto from "crypto";
import { ObjectID } from 'mongodb';
import e from "express";

class RazorPayService {

    async createOrders(params) {
        console.log(params)
        let orderId=parse.getString(params.orderId)
        let amount=parse.getNumberIfValid(params.amount)
        console.log(ObjectID(orderId))
        console.log(amount)
        let order = await OrdersService.getSingleOrder(ObjectID(orderId))
        let totalOrderAmount = 0
        console.log(order)
        order.items.forEach(function (item, index) {
            totalOrderAmount = totalOrderAmount + item.price_total
        });
        if (totalOrderAmount != amount) {
            return { status: false, "msg": "order amount is tampered",respCode:400 }
        }
        console.log(totalOrderAmount)
        let orderResponse:any = await createOrder({
            "amount":Number(totalOrderAmount)*100,
            "currency": "INR",
            "receipt": order.id

        })
        console.log(orderResponse)

        let result= {}
        if (orderResponse.status == "created"){
            console.log("syccessasdadadadsadadadasdsasd")
            order.status=orderResponse.status
            order.payment_method="razorpay"
            order.payment_method_gateway="razorpay"
            order.gateway_response=orderResponse
            console.log(order)
            let updateResp=await OrdersService.updateOrder(order.id,order)
            console.log(updateResp)
            result={ status: false, "msg": "success" , respCode:200,"OrderId":orderResponse.id}
        }else{
            result={ status: false, "msg": "failure" , respCode:500,"OrderId":orderResponse.id}
        }
        return result
    }


    async verifyPayment(params){
        let response = {"signatureIsValid":"false"}
        let razorpay_order_id=parse.getString(params.razorpay_order_id)
        let razorpay_payment_id=parse.getString(params.razorpay_payment_id)
        let razorpay_signature=parse.getString(params.razorpay_signature)
        let falcanoOrderId=parse.getString(params.orderId)

        console.log(falcanoOrderId)
        try {

            let body=razorpay_order_id + "|" + razorpay_payment_id;
    
            let expectedSignature = crypto.createHmac('sha256', 'gTkfd2mv8FagvHjM6gfHisLa')
                                            .update(body.toString())
                                            .digest('hex');
            console.log("sig received " ,razorpay_signature);
            console.log("sig generated " ,expectedSignature);
            let order = await OrdersService.getSingleOrder(ObjectID(falcanoOrderId))
            console.log(order)
            if(expectedSignature === razorpay_signature){
                response={"signatureIsValid":"true"}
                order.payment_response={"paymentId":razorpay_payment_id,"paymentStatus":"success","paymentTime":new Date().toISOString()}

            }else{
                order.payment_response={"paymentId":razorpay_payment_id,"paymentStatus":"failure","paymentTime":new Date().toISOString()}
            }
            let updatedOrder=await OrdersService.updateOrder(order.id,order)    
            console.log(updatedOrder)       
        } catch (error) {
            console.log(error)
        }

        return response
    }

    async cancelOrder(params){
        
    }


}
export default RazorPayService


//pay_LNPnLuTYvsldLe
//order_LNPQPObz27pNwM
//fc4c12d756f998d66dac037d23fd2409d532c5ba34a16fe93264c8a06a1c7197
//{"orderId":"6403049e13ef3e36fc6a3228",razorpay_payment_id":"pay_LNPnLuTYvsldLe","razorpay_order_id":"order_LNPQPObz27pNwM","razorpay_signature":"fc4c12d756f998d66dac037d23fd2409d532c5ba34a16fe93264c8a06a1c7197"}
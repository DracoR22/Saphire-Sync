import { styles } from "@/app/styles/style";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from "react-toastify";

interface Props {
  setOpen: any;
  data: any;
  user:any;
  refetch:any;
}

const CheckOutForm = ({setOpen, data, user, refetch}: Props) => {

   // Stripe Elements
   const stripe = useStripe()
   const elements = useElements()

   // States
   const [message, setMessage] = useState<any>("");
   const [isLoading, setIsLoading] = useState(false);

   // Get The Create Order Mutation
   const [createOrder, { data: orderData, error }] = useCreateOrderMutation();

   const handleSubmit = async (e: any) => {
    e.preventDefault()
    if(!stripe || !elements) {
      return
    }
    setIsLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({ elements, redirect: "if_required" });
    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsLoading(false);
      // Create The Order
      createOrder({ courseId: data._id, payment_info: paymentIntent });
    }
   }

   // If The Order Is Succesfull, Redirect To The Course Access
   useEffect(() => {
    if(orderData) {
     refetch();
     toast.success('Your order has been succesful!')

    //  socketId.emit("notification", {
    //     title: "New Order",
    //     message: `You have a new order from ${data.name}`,
    //     userId: user._id,
    //  });
  
     redirect(`/course-access/${data._id}`);
    }
    if(error){
     if ("data" in error) {
         const errorMessage = error as any;
         toast.error(errorMessage.data.message);
       }
    }
   }, [orderData,error])

    return (
      <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text" className={`${styles.button} mt-2 !h-[35px]`}>
          {isLoading ?  <BiLoaderAlt className="h-6 w-6 animate-spin" /> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && (
        <div id="payment-message" className="text-[red] font-Poppins pt-2">
          {message}
        </div>
      )}
    </form>
    )
}

export default CheckOutForm

'use client'

import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";
import { useCreatePaymentIntentMutation, useGetStripePublishablekeyQuery } from "@/redux/features/payments/paymentsApi";
import { loadStripe } from "@stripe/stripe-js";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

interface Props {
    id: string
}

const CourseDetailsPage = ({ id }: Props) => {

  // Modals States
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);

  // Stripe States
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");

  // Get Course Query
  const {data, isLoading} = useGetCourseDetailsQuery(id)

  // Get Stripe Publishable Key
  const { data: config } = useGetStripePublishablekeyQuery({})

  // Get Create Payment Mutation
  const [createPaymentIntent, { data: paymentIntentData }] = useCreatePaymentIntentMutation();

  // Get load User Query
  const { data: userData } = useLoadUserQuery(undefined, {});

  useEffect(() => {
    if (config) {
      const publishablekey = config?.publishablekey;
      setStripePromise(loadStripe(publishablekey));
    }
    if (data && userData?.user) {
      const amount = Math.round(data.course.price * 100);
      createPaymentIntent(amount);
    }
  }, [config, data, userData]);

  useEffect(() => {
    if (paymentIntentData) {
      setClientSecret(paymentIntentData?.client_secret);
    }
  }, [paymentIntentData]);

  return (
    <>
      {isLoading ? (
        <Loader/>
      ) : (
        <div>
          <Heading
           title={data.course.name + " - Sapphire"}
           description={"Saphire Sync is a platform for students to learn and get help from teachers"}
           keywords={data?.course?.tags}/>
            <Header route={route} setRoute={setRoute} open={open} setOpen={setOpen} activeItem={1}/>
             {stripePromise && (
              <CourseDetails data={data.course} stripePromise={stripePromise} clientSecret={clientSecret} setRoute={setRoute} setOpen={setOpen}/>
             )}
            <Footer/>
        </div>
      )}
    </>
  )
}

export default CourseDetailsPage

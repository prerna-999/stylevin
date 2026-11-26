import Head from "next/head";
import OrderConfirmation from "@/components/order-confirmation";

export default function OrderConfirmationPage() {
  return (
    <>
      <Head>
        <title>Order Confirmed | STYLEVIN</title>
        <meta name="robots" content="noindex" />
      </Head>
      <OrderConfirmation />
    </>
  );
}

import Head from "next/head";
import CheckoutPage from "@/components/checkout";

export default function Checkout() {
  return (
    <>
      <Head>
        <title>Checkout | STYLEVIN</title>
        <meta name="robots" content="noindex" />
      </Head>
      <CheckoutPage />
    </>
  );
}

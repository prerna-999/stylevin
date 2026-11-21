import Head from "next/head";
import CartPage from "@/components/cart";

export default function Cart() {
  return (
    <>
      <Head>
        <title>Your Cart | STYLEVIN</title>
      </Head>
      <CartPage />
    </>
  );
}

import Head from "next/head";
import TrackOrder from "@/components/track-order";

export default function TrackOrderPage() {
  return (
    <>
      <Head>
        <title>Track Order | STYLEVIN</title>
        <meta name="robots" content="noindex" />
      </Head>
      <TrackOrder />
    </>
  );
}

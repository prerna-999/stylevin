import Head from "next/head";
import ComboOffersPage from "@/components/combo-offers";

export default function ComboOffers() {
  return (
    <>
      <Head>
        <title>Combo Offers | STYLEVIN</title>
        <meta
          name="description"
          content="Buy together and save more. Shop STYLEVIN combo offers - tee + cargo, hoodie + joggers, shirt + trouser and more."
        />
      </Head>
      <ComboOffersPage />
    </>
  );
}

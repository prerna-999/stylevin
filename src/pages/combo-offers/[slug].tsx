import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import ComboDetail from "@/components/combo-offers/ComboDetail";
import { COMBO_DEALS, ComboDeal, getComboBySlug } from "@/lib/combos";

interface ComboPageProps {
  combo: ComboDeal;
}

const ComboPage: React.FC<ComboPageProps> = ({ combo }) => (
  <ComboDetail combo={combo} />
);

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: COMBO_DEALS.map((c) => ({ params: { slug: c.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async (context) => {
  const combo = getComboBySlug(context.params?.slug as string);
  if (!combo) return { notFound: true };
  return { props: { combo } };
};

export default ComboPage;

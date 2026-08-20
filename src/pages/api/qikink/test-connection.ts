import type { NextApiRequest, NextApiResponse } from "next";
import { getQikinkAccessToken } from "@/lib/qikink/client";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = await getQikinkAccessToken();
    res.status(200).json({
      success: true,
      message: "Qikink token fetched successfully.",
      tokenPreview: `${token.slice(0, 8)}...`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
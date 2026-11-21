import type { NextApiRequest, NextApiResponse } from "next";
import { createQikinkOrder } from "@/lib/qikink/orders";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await createQikinkOrder({
      order_number: `test${Math.floor(Math.random() * 100000)}`, // must be <= 15 chars
      qikink_shipping: "1",
      gateway: "COD",
      total_order_value: "1",
      line_items: [
        {
          search_from_my_products: 0,
          quantity: "1",
          price: "1",
          sku: "MVnHs-Wh-S", // TODO: replace with a real sandbox-valid SKU
          print_type_id: "1", // TODO: confirm correct value for your print method
          designs: [
            {
              design_code: "iPhoneXR",
              width_inches: "10",
              height_inches: "12",
              placement_sku: "fr",
              design_link:
                "https://sgp1.digitaloceanspaces.com/cdn.qikink.com/erp2/assets/designs/83/1696668376.jpg",
              mockup_link:
                "https://sgp1.digitaloceanspaces.com/cdn.qikink.com/erp2/assets/designs/83/1696668376.jpg",
            },
          ],
        },
      ],
      shipping_address: {
        first_name: "Test",
        last_name: "User",
        address1: "123 Test Street",
        phone: "9999999999",
        email: "test@example.com",
        city: "Chandigarh",
        zip: "160001",
        province: "Chandigarh",
        country_code: "IN",
      },
    });

    return res.status(200).json({ success: true, result });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
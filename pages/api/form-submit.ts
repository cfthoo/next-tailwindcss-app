import { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";
import { schema } from "@/pages/validation/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { name, email } = req.body;

    // validate again in server side
    schema.parse({ name, email });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

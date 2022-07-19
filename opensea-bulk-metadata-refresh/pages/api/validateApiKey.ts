// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

type Data = {
  status: number;
};

const OTHER_DEEDS_SUPPLY = 100000;

// Return output string
async function validateApi(apiKey: string): Promise<Data> {
  // Choose random other deeds token to validate.
  // Note: we don't use the same token every time because the OpenSea API seems to return
  // a cached result sometimes without validating when same endpoint is hit twice, so validating
  // API key may not work
  const tokenId = Math.floor(Math.random() * OTHER_DEEDS_SUPPLY);
  const url = `https://api.opensea.io/api/v1/asset/0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258/${tokenId}/validate`;
  const res = await fetch(url, {
    headers: { "X-API-KEY": apiKey },
  });

  return { status: res.status };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const apiKey = req.query.apiKey as string;
  const results = await validateApi(apiKey);
  res.status(200).json(results);
}

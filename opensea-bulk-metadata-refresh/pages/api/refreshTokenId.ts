// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

type Data = {
  output: string;
  status: number;
};

type BulkRefreshParams = {
  contractAddress: string;
  tokenId: string;
  apiKey: string;
};

// Return output string
async function bulkRefresh({
  tokenId,
  apiKey,
  contractAddress,
}: BulkRefreshParams): Promise<Data> {
  const url = `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}/?force_update=true`;
  const res = await fetch(url, {
    headers: { "X-API-KEY": apiKey },
  });
  const output =
    res.status === 200
      ? `Successfully submitted ${tokenId} for metadata refresh`
      : `Failed to submit ${tokenId} for metadata refresh; status code ${res.status}`;
  return { output, status: res.status };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const tokenId = req.query.tokenId as string;
  const apiKey = req.query.apiKey as string;
  const contractAddress = req.query.contractAddress as string;
  const results = await bulkRefresh({ tokenId, apiKey, contractAddress });
  res.status(200).json(results);
}

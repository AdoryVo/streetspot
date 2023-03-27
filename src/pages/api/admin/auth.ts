import type { NextApiRequest, NextApiResponse } from 'next'

// GET /api/auth
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.cookies.adminToken === process.env.ADMIN_TOKEN) {
    res.status(200).end()
  } else {
    res.status(404).end()
  }
}

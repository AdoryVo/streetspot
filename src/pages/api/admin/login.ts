import type { NextApiRequest, NextApiResponse } from 'next'

// POST /api/admin-login
// Required fields in body: password
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { password } = req.body

  const Local_Pass = process.env.ADMIN_PASS
  if (password === Local_Pass) {
    res.setHeader('Set-Cookie', `adminToken=${process.env.ADMIN_TOKEN}; Path=/`)
    res.status(200).end()
  } else {
    res.status(401).end()
  }
}

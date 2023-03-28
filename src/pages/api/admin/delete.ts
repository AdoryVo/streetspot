import { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'

// DELETE /api/admin/delete?id=<id>
// Required fields in query: id
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query // { id: <id> }

  try {
    await prisma.report.delete({ where: { id: String(id) } })
    res.status(200).json({ message: 'Report deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to delete report' })
  }
}

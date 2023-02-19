import type { Report } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'

// POST /api/report/like
// Required fields in body: id, isLiked
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Report>
) {
  const { id, isLiked } = req.body

  let update
  if (isLiked) {
    update = { increment: 1 }
  }
  else {
    update = { decrement: 1 }
  }

  const report = await prisma.report.update({
    where: { id },
    data: { likes: update },
  })

  return res.status(200).json(report)
}

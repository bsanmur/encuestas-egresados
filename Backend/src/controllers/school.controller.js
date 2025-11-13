import { prisma } from '../lib/prisma.js';

export async function schoolAnalytics(req, res) {
  try {
    const schoolId = req.user.schoolId;
    if (!schoolId) return res.status(400).json({ message: 'User is not linked to a school' });

    const total = await prisma.alumniProfile.count({ where: { schoolId, isApproved: true } });
    const employed = await prisma.alumniProfile.count({ where: { schoolId, isApproved: true, employmentStatus: 'EMPLOYED' } });
    const employmentRate = total ? Math.round((employed / total) * 100) : 0;

    const majors = await prisma.alumniProfile.groupBy({
      by: ['major'],
      where: { schoolId, isApproved: true },
      _count: { _all: true },
      orderBy: { _count: { _all: 'desc' } },
      take: 5
    });
    const topSectors = majors.map(m => ({ name: m.major, count: m._count._all }));

    res.json({ employmentRate, avgSalary: null, topSectors });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}

import { prisma } from '../lib/prisma.js';

export async function getMyProfile(req, res) {
  try {
    const profile = await prisma.alumniProfile.findUnique({
      where: { userId: req.user.id },
      include: { school: { select: { id: true, name: true } } }
    });
    if (!profile) return res.status(404).json({ message: 'Profile not found. Please complete your registration.' });
    res.json(profile);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function updateMyProfile(req, res) {
  const { phone, currentJobTitle, currentCompany, employmentStatus } = req.body;
  try {
    const updated = await prisma.alumniProfile.update({
      where: { userId: req.user.id },
      data: { phone, currentJobTitle, currentCompany, employmentStatus }
    });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Update failed' });
  }
}

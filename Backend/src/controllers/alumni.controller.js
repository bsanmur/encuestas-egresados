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

// PUT /api/alumni/subscribe (Protected)
export async function updateSubscription(req, res) {
  const { isSubscribed } = req.body;
  if (typeof isSubscribed !== "boolean") {
    return res
      .status(400)
      .json({ message: "isSubscribed must be a boolean value." });
  }

  try {
    // Attempt update by id; adjust parsing if your Prisma model uses Int ids
    const id = req.userId;
    const where = { id };

    const alumnus = await prisma.alumnus.update({
      where,
      data: { isSubscribed },
      select: { isSubscribed: true },
    });

    res.json({
      message: `Subscription status updated to: ${
        isSubscribed ? "Subscribed" : "Unsubscribed"
      }`,
      isSubscribed: alumnus.isSubscribed,
    });
  } catch (error) {
    console.error(error);
    // If update fails due to id type mismatch, log and return 404 for now
    res.status(500).json({ message: "Error updating subscription status." });
  }
}

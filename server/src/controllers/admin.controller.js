import { prisma } from '../lib/prisma.js';

export async function listAlumni(req, res) {
  try {
    const alumni = await prisma.alumniProfile.findMany({
      include: { user: { select: { id: true, email: true, role: true } }, school: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(alumni);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function updateAlumni(req, res) {
  const { id } = req.params;
  const { fullName, phone, graduationYear, major, studentId, currentJobTitle, currentCompany, employmentStatus, schoolId, isApproved } = req.body;
  try {
    const updated = await prisma.alumniProfile.update({
      where: { id },
      data: {
        fullName,
        phone,
        graduationYear: graduationYear !== undefined ? Number(graduationYear) : undefined,
        major,
        studentId,
        currentJobTitle,
        currentCompany,
        employmentStatus,
        schoolId,
        isApproved
      }
    });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Update failed' });
  }
}

export async function deleteAlumni(req, res) {
  const { id } = req.params;
  try {
    const profile = await prisma.alumniProfile.delete({ where: { id } });
    // optionally also delete user? here we keep user record
    res.json({ success: true, deletedId: profile.id });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Delete failed' });
  }
}

export async function approveAlumni(req, res) {
  const { id } = req.params;
  try {
    const updated = await prisma.alumniProfile.update({ where: { id }, data: { isApproved: true } });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Approve failed' });
  }
}

export async function listSchools(req, res) {
  try {
    const schools = await prisma.school.findMany({ orderBy: { name: 'asc' } });
    res.json(schools);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function createSchool(req, res) {
  const { name, description, contactPerson } = req.body;
  try {
    const school = await prisma.school.create({ data: { name, description, contactPerson } });
    res.status(201).json(school);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Create failed' });
  }
}

export async function updateSchool(req, res) {
  const { id } = req.params;
  const { name, description, contactPerson } = req.body;
  try {
    const school = await prisma.school.update({ where: { id }, data: { name, description, contactPerson } });
    res.json(school);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Update failed' });
  }
}

export async function deleteSchool(req, res) {
  const { id } = req.params;
  try {
    const school = await prisma.school.delete({ where: { id } });
    res.json({ success: true, deletedId: school.id });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Delete failed' });
  }
}

export async function assignUserToSchool(req, res) {
  const { userId, schoolId } = req.body;
  if (!userId || !schoolId) return res.status(400).json({ message: 'userId and schoolId required' });
  try {
    const user = await prisma.user.update({ where: { id: userId }, data: { role: 'SCHOOL', schoolId } });
    res.json({ id: user.id, email: user.email, role: user.role, schoolId: user.schoolId });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Assign failed' });
  }
}

export async function globalAnalytics(req, res) {
  try {
    const total = await prisma.alumniProfile.count();
    const employed = await prisma.alumniProfile.count({ where: { employmentStatus: 'EMPLOYED' } });
    const employmentRate = total ? Math.round((employed / total) * 100) : 0;

    // Top majors as a proxy for sectors
    const majors = await prisma.alumniProfile.groupBy({ by: ['major'], _count: { _all: true }, orderBy: { _count: { _all: 'desc' } }, take: 5 });
    const topSectors = majors.map(m => ({ name: m.major, count: m._count._all }));

    res.json({ totalAlumni: total, employmentRate, topSectors });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function createSurvey(req, res) {
  const adminUserId = req.user.id;
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'title required' });
  try {
    const survey = await prisma.survey.create({ data: { title, description, createdById: adminUserId } });
    res.status(201).json(survey);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Create failed' });
  }
}

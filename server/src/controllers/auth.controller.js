import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, schoolId: user.schoolId || null },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function register(req, res) {
  try {
    const {
      email,
      password,
      fullName,
      phone,
      graduationYear,
      major,
      studentId,
      currentJobTitle,
      currentCompany,
      employmentStatus,
      schoolId
    } = req.body;

    if (!email || !password || !fullName || !graduationYear || !major || !schoolId || !employmentStatus) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: 'ALUMNI',
      }
    });

    const profile = await prisma.alumniProfile.create({
      data: {
        userId: user.id,
        fullName,
        phone,
        graduationYear: Number(graduationYear),
        major,
        studentId,
        currentJobTitle,
        currentCompany,
        employmentStatus,
        schoolId,
        isApproved: false
      }
    });

    const token = signToken(user);
    return res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function forgotPassword(req, res) {
  // Placeholder - integrate email service later
  return res.json({ message: 'If the email exists, password reset instructions will be sent.' });
}

export async function getSchools(req, res) {
  try {
    const schools = await prisma.school.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });
    res.json(schools);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
}

import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

dotenv.config();

// Configuración del administrador
// Puedes cambiar estos valores según tus necesidades
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function seedAdmin() {
  try {
    console.log('🌱 Creating admin user...\n');

    // Verificar si ya existe un admin con este email
    const existing = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL }
    });

    if (existing) {
      if (existing.role === 'ADMIN') {
        console.log(`⚠️  Admin user with email "${ADMIN_EMAIL}" already exists.`);
        console.log('   If you want to reset the password, delete the user first or update it manually.');
        await prisma.$disconnect();
        return;
      } else {
        console.log(`⚠️  User with email "${ADMIN_EMAIL}" exists but is not an admin.`);
        console.log('   Updating role to ADMIN...');
        const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await prisma.user.update({
          where: { id: existing.id },
          data: {
            role: 'ADMIN',
            password: hashed
          }
        });
        console.log(`✅ Updated user to ADMIN: ${ADMIN_EMAIL}`);
        await prisma.$disconnect();
        return;
      }
    }

    // Crear nuevo usuario administrador
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const admin = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        password: hashed,
        role: 'ADMIN'
      }
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin.id}`);
    console.log(`\n⚠️  Default password: ${ADMIN_PASSWORD}`);
    console.log('   Please change this password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();


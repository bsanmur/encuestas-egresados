import dotenv from 'dotenv';
import { prisma } from '../lib/prisma.js';

dotenv.config();

const schools = [
  {
    name: 'Facultad de Ingeniería',
    description: 'Facultad de Ingeniería - Universidad Nacional',
    contactPerson: 'Dr. Juan Pérez'
  },
  {
    name: 'Facultad de Ciencias',
    description: 'Facultad de Ciencias - Universidad Nacional',
    contactPerson: 'Dra. María González'
  },
  {
    name: 'Facultad de Economía',
    description: 'Facultad de Economía - Universidad Nacional',
    contactPerson: 'Dr. Carlos Rodríguez'
  },
  {
    name: 'Facultad de Medicina',
    description: 'Facultad de Medicina - Universidad Nacional',
    contactPerson: 'Dra. Ana Martínez'
  },
  {
    name: 'Facultad de Derecho',
    description: 'Facultad de Derecho - Universidad Nacional',
    contactPerson: 'Dr. Luis Fernández'
  }
];

async function seedSchools() {
  try {
    console.log('🌱 Seeding schools...\n');

    for (const schoolData of schools) {
      try {
        const school = await prisma.school.create({
          data: schoolData
        });
        console.log(`✅ Created school: ${school.name} (ID: ${school.id})`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️  School "${schoolData.name}" already exists, skipping...`);
        } else {
          console.error(`❌ Error creating school "${schoolData.name}":`, error.message);
        }
      }
    }

    console.log('\n✨ Seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding schools:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSchools();


import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'personal_manual@email.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                name: 'Manual Trainer',
                email,
                password: hashedPassword,
                role: 'TRAINER',
                cref: '999999-G/SP',
                phone: '11999999999'
            }
        });
        console.log('Created user:', user);
    } catch (e) {
        console.error('Error creating user:', e);
    }
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });

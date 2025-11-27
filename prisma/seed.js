const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('123456', 10);

    const trainer = await prisma.user.upsert({
        where: { email: 'trainer@helpfit.com' },
        update: {},
        create: {
            email: 'trainer@helpfit.com',
            name: 'John Trainer',
            password,
            role: 'TRAINER',
        },
    });

    console.log({ trainer });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

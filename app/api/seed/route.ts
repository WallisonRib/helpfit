import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
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
    
    return NextResponse.json({ success: true, trainer });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

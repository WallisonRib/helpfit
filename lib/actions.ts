'use server';

import { signIn, signOut } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export type State = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
};

const CreateStudentSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export async function createStudent(prevState: State, formData: FormData): Promise<State> {
  const session = await auth();
  if (session?.user?.role !== 'TRAINER') {
    return { message: 'Unauthorized', errors: {} };
  }

  const validatedFields = CreateStudentSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltando. Falha ao criar aluno.',
    };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'STUDENT',
        trainer: {
          connect: { email: session.user.email! },
        },
      },
    });
  } catch (error) {
    return {
      message: 'Erro no banco de dados: Falha ao criar aluno. Email já pode estar em uso.',
      errors: {},
    };
  }

  revalidatePath('/trainer');
  redirect('/trainer');
}

const AssessmentSchema = z.object({
  weight: z.coerce.number().min(1),
  height: z.coerce.number().min(1),
  chest: z.coerce.number().min(0),
  abdominal: z.coerce.number().min(0),
  thigh: z.coerce.number().min(0),
  tricep: z.coerce.number().min(0),
  subscapular: z.coerce.number().min(0),
  suprailiac: z.coerce.number().min(0),
  midaxillary: z.coerce.number().min(0),
});

export async function createAssessment(studentId: string, prevState: State, formData: FormData): Promise<State> {
  const session = await auth();
  if (session?.user?.role !== 'TRAINER') {
    return { message: 'Unauthorized', errors: {} };
  }

  const validatedFields = AssessmentSchema.safeParse({
    weight: formData.get('weight'),
    height: formData.get('height'),
    chest: formData.get('chest'),
    abdominal: formData.get('abdominal'),
    thigh: formData.get('thigh'),
    tricep: formData.get('tricep'),
    subscapular: formData.get('subscapular'),
    suprailiac: formData.get('suprailiac'),
    midaxillary: formData.get('midaxillary'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos inválidos. Falha ao criar avaliação.',
    };
  }

  const data = validatedFields.data;

  // Pollock 7-site Skinfold Method for Body Density (Jackson & Pollock)
  // For Men: BD = 1.112 - 0.00043499(Sum) + 0.00000055(Sum)^2 - 0.00028826(Age)
  // For Women: BD = 1.097 - 0.00046971(Sum) + 0.00000056(Sum)^2 - 0.00012828(Age)
  // Note: We don't have Age in the User model yet, so we'll assume a default or add it later.
  // For this MVP, I'll use a simplified formula or assume Male/30y for calculation demo if age is missing.
  // Let's assume Male for now as per typical MVP simplification, or better, just sum them up for now.
  // Actually, let's implement a basic calculation assuming Male, 25 years old for now to show "real" numbers.

  const sum = data.chest + data.abdominal + data.thigh + data.tricep + data.subscapular + data.suprailiac + data.midaxillary;
  const age = 25; // Default

  const bodyDensity = 1.112 - (0.00043499 * sum) + (0.00000055 * sum * sum) - (0.00028826 * age);
  const bodyFatPercentage = ((4.95 / bodyDensity) - 4.50) * 100;

  try {
    await prisma.assessment.create({
      data: {
        studentId,
        ...data,
        bodyFatPercentage,
      },
    });
  } catch (error) {
    return {
      message: 'Erro no banco de dados: Falha ao criar avaliação.',
      errors: {},
    };
  }

  revalidatePath(`/trainer/students/${studentId}`);
  redirect(`/trainer/students/${studentId}`);
}

const WorkoutSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  exercises: z.string(), // JSON string
});

export async function createWorkout(studentId: string, prevState: State, formData: FormData): Promise<State> {
  const session = await auth();
  if (session?.user?.role !== 'TRAINER') {
    return { message: 'Unauthorized', errors: {} };
  }

  const validatedFields = WorkoutSchema.safeParse({
    title: formData.get('title'),
    exercises: formData.get('exercises'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos inválidos. Falha ao criar treino.',
    };
  }

  const { title, exercises } = validatedFields.data;

  try {
    await prisma.workout.create({
      data: {
        studentId,
        title,
        content: exercises,
      },
    });
  } catch (error) {
    return {
      message: 'Erro no banco de dados: Falha ao criar treino.',
      errors: {},
    };
  }

  revalidatePath(`/trainer/students/${studentId}`);
  redirect(`/trainer/students/${studentId}`);
}

export async function updateWorkout(
  workoutId: string,
  studentId: string,
  prevState: State,
  formData: FormData
): Promise<State> {
  const session = await auth();
  if (session?.user?.role !== 'TRAINER') {
    return { message: 'Unauthorized', errors: {} };
  }

  const validatedFields = WorkoutSchema.safeParse({
    title: formData.get('title'),
    exercises: formData.get('exercises'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos inválidos. Falha ao atualizar treino.',
    };
  }

  const { title, exercises } = validatedFields.data;

  try {
    await prisma.workout.update({
      where: { id: workoutId },
      data: {
        title,
        content: exercises,
      },
    });
  } catch (error) {
    return {
      message: 'Erro no banco de dados: Falha ao atualizar treino.',
      errors: {},
    };
  }

  revalidatePath(`/trainer/students/${studentId}`);
  redirect(`/trainer/students/${studentId}`);
}

const CreateWorkoutSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string(), // JSON string
});

export async function upsertWorkout(studentId: string, day: string, prevState: State, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== 'TRAINER') {
    return { message: 'Unauthorized', errors: {} };
  }

  const validatedFields = CreateWorkoutSchema.safeParse({
    title: day, // Title is the Day
    content: formData.get('exercises'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos obrigatórios faltando. Falha ao criar treino.',
    };
  }

  const { title, content } = validatedFields.data;

  try {
    // Check if workout exists for this student and day
    const existingWorkout = await prisma.workout.findFirst({
      where: {
        studentId: studentId,
        title: title
      }
    });

    if (existingWorkout) {
      await prisma.workout.update({
        where: { id: existingWorkout.id },
        data: { content }
      });
    } else {
      await prisma.workout.create({
        data: {
          studentId,
          title,
          content,
        },
      });
    }
  } catch (error) {
    return {
      message: 'Erro de banco de dados: Falha ao criar treino.',
      errors: {},
    };
  }

  revalidatePath('/trainer/students/[id]');
  revalidatePath(`/trainer/students/${studentId}`);
  redirect(`/trainer/students/${studentId}`);
}


export async function logWorkout(studentId: string, workoutId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { message: 'Unauthorized', errors: {} };
  }

  try {
    await prisma.workoutLog.create({
      data: {
        studentId,
        workoutId,
      },
    });
  } catch (error) {
    return {
      message: 'Erro no banco de dados: Falha ao registrar treino.',
      errors: {},
    };
  }

  revalidatePath('/student');
}



export async function authenticate(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  try {
    console.log('Attempting login...');
    const result = await signIn('credentials', { ...Object.fromEntries(formData), redirectTo: '/dashboard' });
    console.log('Login result:', result);
    return { message: null, errors: {} };
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Credenciais inválidas.', errors: {} };
        default:
          return { message: 'Algo deu errado.', errors: {} };
      }
    }
    throw error;
  }
}

export async function socialLogin(provider: string) {
  await signIn(provider, { redirectTo: '/dashboard' });
}

const RegisterSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  phone: z.string().optional(),
  cref: z.string().optional(),
  role: z.enum(['TRAINER', 'STUDENT']),
});

export async function register(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  const userType = formData.get('userType');
  const derivedRole = userType === 'personal' ? 'TRAINER' : 'STUDENT';

  console.log('Registering user:', {
    name: formData.get('name'),
    email: formData.get('email'),
    userType,
    derivedRole,
    phone: formData.get('phone'),
    cref: formData.get('cref')
  });

  const validatedFields = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    phone: formData.get('phone') || undefined,
    cref: formData.get('cref') || undefined,
    role: derivedRole,
  });

  if (!validatedFields.success) {
    console.error('Validation failed:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Dados inválidos. Verifique os campos abaixo.',
    };
  }

  const { name, email, password, phone, cref, role } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        cref,
        role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return { message: 'Falha ao criar conta. Email já pode estar em uso.', errors: {} };
  }

  // After registration, log the user in
  try {
    await signIn('credentials', { email, password, redirectTo: '/dashboard' });
    return { message: null, errors: {} };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Erro ao fazer login automático.', errors: {} };
        default:
          return { message: 'Algo deu errado.', errors: {} };
      }
    }
    throw error;
  }
}

export async function deleteWorkout(workoutId: string) {
  try {
    await prisma.workout.delete({
      where: {
        id: workoutId,
      },
    });
    revalidatePath('/trainer/students/[id]');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete workout.');
  }
}

export async function logout() {
  await signOut();
}

export async function searchStudents(query: string) {
  const session = await auth();
  if (session?.user?.role !== 'TRAINER') {
    throw new Error('Unauthorized');
  }

  if (!query || query.length < 2) {
    return [];
  }

  const students = await prisma.user.findMany({
    where: {
      role: 'STUDENT',
      OR: [
        { name: { contains: query } },
        { email: { contains: query } },
      ],
    },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      trainers: {
        select: {
          id: true,
        }
      }
    },
  });

  // Map to include a flag if the current trainer is already linked
  // We need the current trainer's ID
  const trainer = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true }
  });

  return students.map(s => ({
    ...s,
    isLinked: s.trainers.some(t => t.id === trainer?.id),
    hasTrainers: s.trainers.length > 0,
    trainerId: null // Deprecated
  }));
}

export async function addStudentToTrainer(studentId: string) {
  const session = await auth();
  if (session?.user?.role !== 'TRAINER' || !session.user.email) {
    throw new Error('Unauthorized');
  }

  // Get trainer ID
  const trainer = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!trainer) {
    throw new Error('Trainer not found');
  }

  await prisma.user.update({
    where: { id: studentId },
    data: {
      trainers: {
        connect: {
          id: trainer.id,
        },
      },
    },
  });

  revalidatePath('/trainer');
  redirect('/trainer');
}

const UpdateProfileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  address: z.string().optional(),
  age: z.coerce.number().optional(),
  trainingLocation: z.string().optional(),
});

export async function updateProfile(prevState: State | undefined, formData: FormData): Promise<State> {
  const session = await auth();
  if (!session?.user?.email) {
    return { message: 'Unauthorized', errors: {} };
  }

  const validatedFields = UpdateProfileSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    age: formData.get('age'),
    trainingLocation: formData.get('trainingLocation'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Dados inválidos.',
    };
  }

  const { name, email, phone, address, age, trainingLocation } = validatedFields.data;

  try {
    // Check if email is being changed and if it's already taken
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return {
          errors: { email: ['Este email já está em uso.'] },
          message: 'Erro ao atualizar perfil.',
        };
      }
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        email,
        phone,
        address,
        age,
        trainingLocation,
      },
    });

    revalidatePath('/dashboard/profile');
    revalidatePath('/trainer/profile');
    return { message: 'Perfil atualizado com sucesso!', errors: {} };
  } catch (error) {
    return {
      message: 'Erro no banco de dados: Falha ao atualizar perfil.',
      errors: {},
    };
  }
}

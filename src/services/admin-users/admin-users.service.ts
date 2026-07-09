import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/services/db/client';

export type AdminUserSummary = {
  id: number;
  email: string;
  name: string;
  createdAt: string;
};

function toSummary(user: {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}): AdminUserSummary {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function listAdminUsers(): Promise<AdminUserSummary[]> {
  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: 'asc' },
  });

  return users.map(toSummary);
}

function generateTemporaryPassword() {
  return randomBytes(9).toString('base64url');
}

export class EmailAlreadyInUseError extends Error {
  constructor() {
    super('El email ya esta en uso.');
    this.name = 'EmailAlreadyInUseError';
  }
}

export async function createAdminUser(input: {
  email: string;
  name: string;
}): Promise<{ user: AdminUserSummary; temporaryPassword: string }> {
  const existing = await prisma.adminUser.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new EmailAlreadyInUseError();
  }

  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await bcrypt.hash(temporaryPassword, 10);

  const user = await prisma.adminUser.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash,
    },
  });

  return { user: toSummary(user), temporaryPassword };
}

export async function updateAdminUserName(
  id: number,
  name: string,
): Promise<AdminUserSummary> {
  const user = await prisma.adminUser.update({
    where: { id },
    data: { name },
  });

  return toSummary(user);
}

export class CannotDeleteSelfError extends Error {
  constructor() {
    super('No podes eliminar tu propia cuenta.');
    this.name = 'CannotDeleteSelfError';
  }
}

export class CannotDeleteLastUserError extends Error {
  constructor() {
    super('No se puede eliminar el ultimo usuario.');
    this.name = 'CannotDeleteLastUserError';
  }
}

export async function deleteAdminUser(
  id: number,
  requestingUserId: number,
): Promise<void> {
  if (id === requestingUserId) {
    throw new CannotDeleteSelfError();
  }

  const totalUsers = await prisma.adminUser.count();
  if (totalUsers <= 1) {
    throw new CannotDeleteLastUserError();
  }

  await prisma.adminUser.delete({ where: { id } });
}

export async function regenerateAdminUserPassword(
  id: number,
): Promise<{ user: AdminUserSummary; temporaryPassword: string }> {
  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await bcrypt.hash(temporaryPassword, 10);

  const user = await prisma.adminUser.update({
    where: { id },
    data: { passwordHash },
  });

  return { user: toSummary(user), temporaryPassword };
}

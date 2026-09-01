import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getActorId() {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  if (process.env.NODE_ENV === 'production') return null;

  const user = await prisma.user.upsert({
    where: { email: 'local-traveler@oneway.local' },
    update: {},
    create: { email: 'local-traveler@oneway.local', name: 'Local traveler' },
    select: { id: true },
  });
  return user.id;
}


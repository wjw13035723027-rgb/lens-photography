import { prisma } from "@/lib/prisma";
import { getAuthUser, getSafeUser, type SafeUser } from "@/lib/auth";

export async function getCurrentUser(request: Request): Promise<SafeUser | null> {
  const payload = await getAuthUser(request);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return user ? getSafeUser(user) : null;
}

export async function requireAdminUser(request: Request): Promise<SafeUser | null> {
  const user = await getCurrentUser(request);
  return user?.role === "admin" ? user : null;
}

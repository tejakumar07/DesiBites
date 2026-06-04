import { vi } from "vitest";

// Mock PrismaClient with all the methods used across the app
export const prisma = {
  menuItem: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  order: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

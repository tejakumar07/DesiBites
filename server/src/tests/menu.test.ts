import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app";

// Mock the prisma module before importing anything that uses it
vi.mock("../config/prisma", () => import("./__mocks__/prisma"));

// Import the mocked prisma to configure test behavior
const { prisma } = await import("./__mocks__/prisma");

// ─────────────────────────────────────────────
// Sample data
// ─────────────────────────────────────────────
const sampleMenuItems = [
  {
    id: 1,
    name: "Butter Chicken",
    description: "Rich & creamy butter chicken with naan",
    price: 249,
    imageUrl: "https://example.com/butter-chicken.jpg",
    isVeg: false,
  },
  {
    id: 2,
    name: "Paneer Tikka",
    description: "Grilled cottage cheese with spices",
    price: 199,
    imageUrl: "https://example.com/paneer-tikka.jpg",
    isVeg: true,
  },
  {
    id: 3,
    name: "Masala Dosa",
    description: "Crispy dosa with potato filling",
    price: 129,
    imageUrl: "https://example.com/masala-dosa.jpg",
    isVeg: true,
  },
];

// ─────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────
describe("Menu API  —  GET /api/menu", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return all menu items with 200 status", async () => {
    prisma.menuItem.findMany.mockResolvedValue(sampleMenuItems);

    const res = await request(app).get("/api/menu");

    expect(res.status).toBe(200);
    expect(res.body.menu).toHaveLength(3);
    expect(res.body.menu[0]).toHaveProperty("name", "Butter Chicken");
    expect(res.body.menu[1]).toHaveProperty("name", "Paneer Tikka");
    expect(res.body.menu[2]).toHaveProperty("name", "Masala Dosa");
  });

  it("should return an empty array when no menu items exist", async () => {
    prisma.menuItem.findMany.mockResolvedValue([]);

    const res = await request(app).get("/api/menu");

    expect(res.status).toBe(200);
    expect(res.body.menu).toEqual([]);
  });

  it("each menu item should contain required fields", async () => {
    prisma.menuItem.findMany.mockResolvedValue(sampleMenuItems);

    const res = await request(app).get("/api/menu");

    for (const item of res.body.menu) {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("description");
      expect(item).toHaveProperty("price");
      expect(item).toHaveProperty("imageUrl");
      expect(item).toHaveProperty("isVeg");
    }
  });

  it("should return 500 when a database error occurs", async () => {
    prisma.menuItem.findMany.mockRejectedValue(new Error("DB connection lost"));

    const res = await request(app).get("/api/menu");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Failed to get menu");
  });
});

describe("Menu API  —  GET /api/menu/:id", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return a single menu item by id", async () => {
    prisma.menuItem.findUnique.mockResolvedValue(sampleMenuItems[0]);

    const res = await request(app).get("/api/menu/1");

    expect(res.status).toBe(200);
    expect(res.body.item).toHaveProperty("id", 1);
    expect(res.body.item).toHaveProperty("name", "Butter Chicken");
  });

  it("should return null item when the id does not exist", async () => {
    prisma.menuItem.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/api/menu/999");

    expect(res.status).toBe(200);
    expect(res.body.item).toBeNull();
  });

  it("should return 500 when a database error occurs", async () => {
    prisma.menuItem.findUnique.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/api/menu/1");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Failed to get item");
  });
});

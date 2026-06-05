import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app";
// Mock the prisma module before importing anything that uses it
vi.mock("../config/prisma", () => import("./__mocks__/prisma"));
// Import the mocked prisma to configure test behavior
const { prisma } = await import("./__mocks__/prisma");
// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const validOrderPayload = {
    name: "Rahul Sharma",
    address: "42 MG Road, Bengaluru, Karnataka",
    phone: "9876543210",
    items: [
        { menuItemId: 1, quantity: 2 },
        { menuItemId: 3, quantity: 1 },
    ],
};
const createdOrder = {
    id: 1,
    customerName: "Rahul Sharma",
    address: "42 MG Road, Bengaluru, Karnataka",
    phone: "9876543210",
    status: "Order Received",
    createdAt: new Date().toISOString(),
};
// ═════════════════════════════════════════════
//  POST /api/orders  —  Place Order
// ═════════════════════════════════════════════
describe("Order API  —  POST /api/orders  (Place Order)", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });
    it("should create an order with valid input and return 201", async () => {
        prisma.order.create.mockResolvedValue(createdOrder);
        const res = await request(app)
            .post("/api/orders")
            .send(validOrderPayload);
        expect(res.status).toBe(201);
        expect(res.body.order).toHaveProperty("id", 1);
        expect(res.body.order).toHaveProperty("customerName", "Rahul Sharma");
        expect(res.body.order).toHaveProperty("status", "Order Received");
    });
    // ── Input Validation ──────────────────────
    it("should return 400 when name is missing", async () => {
        const { name, ...payload } = validOrderPayload;
        const res = await request(app).post("/api/orders").send(payload);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid inputs");
    });
    it("should return 400 when address is too short (< 10 chars)", async () => {
        const res = await request(app)
            .post("/api/orders")
            .send({ ...validOrderPayload, address: "Short" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid inputs");
        expect(res.body.errors).toHaveProperty("address");
    });
    it("should return 400 when address exceeds 100 characters", async () => {
        const res = await request(app)
            .post("/api/orders")
            .send({ ...validOrderPayload, address: "A".repeat(101) });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid inputs");
        expect(res.body.errors).toHaveProperty("address");
    });
    it("should return 400 when phone number is invalid (not 10 digits starting with 6-9)", async () => {
        const invalidPhones = ["1234567890", "98765", "abcdefghij", "0987654321", ""];
        for (const phone of invalidPhones) {
            const res = await request(app)
                .post("/api/orders")
                .send({ ...validOrderPayload, phone });
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid inputs");
            expect(res.body.errors).toHaveProperty("phone");
        }
    });
    it("should return 400 when items array is empty", async () => {
        const res = await request(app)
            .post("/api/orders")
            .send({ ...validOrderPayload, items: [] });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid inputs");
        expect(res.body.errors).toHaveProperty("items");
    });
    it("should return 400 when items is missing entirely", async () => {
        const { items, ...payload } = validOrderPayload;
        const res = await request(app).post("/api/orders").send(payload);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid inputs");
    });
    it("should return 400 when an item has zero quantity", async () => {
        const res = await request(app)
            .post("/api/orders")
            .send({
            ...validOrderPayload,
            items: [{ menuItemId: 1, quantity: 0 }],
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid inputs");
    });
    it("should return 400 when an item has negative menuItemId", async () => {
        const res = await request(app)
            .post("/api/orders")
            .send({
            ...validOrderPayload,
            items: [{ menuItemId: -1, quantity: 2 }],
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid inputs");
    });
    it("should return 400 when quantity exceeds 100", async () => {
        const res = await request(app)
            .post("/api/orders")
            .send({
            ...validOrderPayload,
            items: [{ menuItemId: 1, quantity: 101 }],
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid inputs");
    });
    it("should return 500 when the database throws during order creation", async () => {
        prisma.order.create.mockRejectedValue(new Error("DB write failure"));
        const res = await request(app)
            .post("/api/orders")
            .send(validOrderPayload);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Failed to place order");
    });
});
// ═════════════════════════════════════════════
//  GET /api/orders/:id  —  Get Order by ID
// ═════════════════════════════════════════════
describe("Order API  —  GET /api/orders/:id  (Get Order)", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });
    it("should return order details with items and totalPrice", async () => {
        const orderWithItems = {
            id: 1,
            customerName: "Rahul Sharma",
            address: "42 MG Road, Bengaluru, Karnataka",
            phone: "9876543210",
            status: "Order Received",
            createdAt: new Date().toISOString(),
            items: [
                {
                    id: 1,
                    quantity: 2,
                    orderId: 1,
                    menuItemId: 1,
                    menuItem: {
                        id: 1,
                        name: "Butter Chicken",
                        description: "Rich & creamy",
                        price: 249,
                        imageUrl: "https://example.com/img.jpg",
                        isVeg: false,
                    },
                },
                {
                    id: 2,
                    quantity: 1,
                    orderId: 1,
                    menuItemId: 3,
                    menuItem: {
                        id: 3,
                        name: "Masala Dosa",
                        description: "Crispy dosa",
                        price: 129,
                        imageUrl: "https://example.com/img2.jpg",
                        isVeg: true,
                    },
                },
            ],
        };
        prisma.order.findUnique.mockResolvedValue(orderWithItems);
        const res = await request(app).get("/api/orders/1");
        expect(res.status).toBe(200);
        expect(res.body.order).toHaveProperty("id", 1);
        expect(res.body.order).toHaveProperty("customerName", "Rahul Sharma");
        expect(res.body.order.items).toHaveLength(2);
        // totalPrice = (2 * 249) + (1 * 129) = 627
        expect(res.body.order).toHaveProperty("totalPrice", 627);
    });
    it("should return 400 when order is not found", async () => {
        prisma.order.findUnique.mockResolvedValue(null);
        const res = await request(app).get("/api/orders/999");
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Orders Not Found");
    });
    it("should return 500 when a database error occurs", async () => {
        prisma.order.findUnique.mockRejectedValue(new Error("DB read error"));
        const res = await request(app).get("/api/orders/1");
        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Failed to get orders");
    });
});
// ═════════════════════════════════════════════
//  GET /api/orders/:id/status  —  Get Order Status
// ═════════════════════════════════════════════
describe("Order API  —  GET /api/orders/:id/status  (Get Status)", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });
    it("should return 'Order Received' for a very recently placed order", async () => {
        prisma.order.findUnique.mockResolvedValue({
            id: 1,
            status: "Order Received",
            createdAt: new Date(), // just now
        });
        const res = await request(app).get("/api/orders/1/status");
        expect(res.status).toBe(200);
        expect(res.body.orderId).toBe(1);
        expect(res.body.status).toBe("Order Received");
    });
    it("should return 'Preparing' for an order placed ~1 minute ago", async () => {
        const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
        prisma.order.findUnique.mockResolvedValue({
            id: 2,
            status: "Order Received",
            createdAt: oneMinuteAgo,
        });
        const res = await request(app).get("/api/orders/2/status");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("Preparing");
    });
    it("should return 'Out for Delivery' for an order placed ~3 minutes ago", async () => {
        const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
        prisma.order.findUnique.mockResolvedValue({
            id: 3,
            status: "Order Received",
            createdAt: threeMinutesAgo,
        });
        const res = await request(app).get("/api/orders/3/status");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("Out for Delivery");
    });
    it("should return 'Delivered' for an order placed >5 minutes ago", async () => {
        const sixMinutesAgo = new Date(Date.now() - 6 * 60 * 1000);
        prisma.order.findUnique.mockResolvedValue({
            id: 4,
            status: "Order Received",
            createdAt: sixMinutesAgo,
        });
        const res = await request(app).get("/api/orders/4/status");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("Delivered");
    });
    it("should return the manually set status when it is NOT 'Order Received'", async () => {
        prisma.order.findUnique.mockResolvedValue({
            id: 5,
            status: "Preparing",
            createdAt: new Date(),
        });
        const res = await request(app).get("/api/orders/5/status");
        expect(res.status).toBe(200);
        // Status is already manually set to "Preparing", so calculateStatus should NOT override
        expect(res.body.status).toBe("Preparing");
    });
    it("should return 404 when order does not exist", async () => {
        prisma.order.findUnique.mockResolvedValue(null);
        const res = await request(app).get("/api/orders/999/status");
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Order Not Found");
    });
    it("should return 500 when a database error occurs", async () => {
        prisma.order.findUnique.mockRejectedValue(new Error("DB error"));
        const res = await request(app).get("/api/orders/1/status");
        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Failed to get order Status");
    });
});
// ═════════════════════════════════════════════
//  PATCH /api/orders/:id/status  —  Update Order Status
// ═════════════════════════════════════════════
describe("Order API  —  PATCH /api/orders/:id/status  (Update Status)", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });
    it("should update status to 'Preparing' and return 200", async () => {
        prisma.order.update.mockResolvedValue({
            id: 1,
            status: "Preparing",
        });
        const res = await request(app)
            .patch("/api/orders/1/status")
            .send({ status: "Preparing" });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Order status updated successfully");
        expect(res.body.order.status).toBe("Preparing");
    });
    it("should update status to 'Out for Delivery'", async () => {
        prisma.order.update.mockResolvedValue({
            id: 1,
            status: "Out for Delivery",
        });
        const res = await request(app)
            .patch("/api/orders/1/status")
            .send({ status: "Out for Delivery" });
        expect(res.status).toBe(200);
        expect(res.body.order.status).toBe("Out for Delivery");
    });
    it("should update status to 'Delivered'", async () => {
        prisma.order.update.mockResolvedValue({
            id: 1,
            status: "Delivered",
        });
        const res = await request(app)
            .patch("/api/orders/1/status")
            .send({ status: "Delivered" });
        expect(res.status).toBe(200);
        expect(res.body.order.status).toBe("Delivered");
    });
    it("should return 400 when status is an invalid value", async () => {
        const res = await request(app)
            .patch("/api/orders/1/status")
            .send({ status: "Cancelled" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid status value");
        expect(res.body.errors).toHaveProperty("status");
    });
    it("should return 400 when status field is missing from body", async () => {
        const res = await request(app)
            .patch("/api/orders/1/status")
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid status value");
    });
    it("should return 400 when status is an empty string", async () => {
        const res = await request(app)
            .patch("/api/orders/1/status")
            .send({ status: "" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid status value");
    });
    it("should return 500 when the database throws during update", async () => {
        prisma.order.update.mockRejectedValue(new Error("DB update failure"));
        const res = await request(app)
            .patch("/api/orders/1/status")
            .send({ status: "Delivered" });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Failed to update order status");
    });
});

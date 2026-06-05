import { describe, it, expect } from "vitest";
import { calculateStatus } from "../utils/order.utill";
describe("calculateStatus  —  Order Status Utility", () => {
    it("should return 'Order Received' when less than 0.75 minutes have passed", () => {
        const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
        expect(calculateStatus(thirtySecondsAgo)).toBe("Order Received");
    });
    it("should return 'Order Received' when order was just placed (0 seconds)", () => {
        const now = new Date();
        expect(calculateStatus(now)).toBe("Order Received");
    });
    it("should return 'Preparing' between 0.75 and 2.5 minutes", () => {
        const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
        expect(calculateStatus(oneMinuteAgo)).toBe("Preparing");
    });
    it("should return 'Preparing' right at 0.75 minutes (45 seconds)", () => {
        const fortyFiveSecondsAgo = new Date(Date.now() - 45 * 1000);
        expect(calculateStatus(fortyFiveSecondsAgo)).toBe("Preparing");
    });
    it("should return 'Out for Delivery' between 2.5 and 5 minutes", () => {
        const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
        expect(calculateStatus(threeMinutesAgo)).toBe("Out for Delivery");
    });
    it("should return 'Out for Delivery' right at 2.5 minutes (150 seconds)", () => {
        const twoAndHalfMinutesAgo = new Date(Date.now() - 150 * 1000);
        expect(calculateStatus(twoAndHalfMinutesAgo)).toBe("Out for Delivery");
    });
    it("should return 'Delivered' at exactly 5 minutes", () => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        expect(calculateStatus(fiveMinutesAgo)).toBe("Delivered");
    });
    it("should return 'Delivered' for orders placed more than 5 minutes ago", () => {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        expect(calculateStatus(tenMinutesAgo)).toBe("Delivered");
    });
    it("should return 'Delivered' for very old orders (hours ago)", () => {
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        expect(calculateStatus(twoHoursAgo)).toBe("Delivered");
    });
});

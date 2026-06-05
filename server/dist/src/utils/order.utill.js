export function calculateStatus(createdAt) {
    const minutes = (Date.now() - createdAt.getTime()) / 1000 / 60;
    if (minutes < 0.75) {
        return "Order Received";
    }
    if (minutes < 2.5) {
        return "Preparing";
    }
    if (minutes < 5) {
        return "Out for Delivery";
    }
    return "Delivered";
}

export function calculateStatus(createdAt: Date): string {
  const minutes = (Date.now() - createdAt.getTime()) / 1000 / 60;

  if (minutes < 2) {
    return "Preparing";
  }

  if (minutes < 5) {
    return "Out for the Delivery";
  }

  return "Delivered";
}

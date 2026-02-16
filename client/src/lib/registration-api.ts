// Registration API - submits to KNCCI messaging endpoint
// Uses /api/registration proxy to avoid CORS

export interface RegistrationPayload {
  event: { id: string; name: string };
  attendee: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    organization?: string;
  };
  tickets: Array<{
    ticketTypeId: string;
    name: string;
    quantity: number;
    price: number;
    currency: string;
  }>;
  payment: {
    method: string;
    amount: number;
    status: string;
    currency?: string;
    transactionId?: string;
    phoneNumber?: string;
    paidAt?: string;
  };
  discount?: { code: string; amount: number };
  metadata: {
    source: string;
    userAgent: string;
    timestamp: string;
  };
}

export async function submitRegistration(
  payload: RegistrationPayload
): Promise<{ success: boolean }> {
  const response = await fetch("/api/registration", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: "Registration failed" }));
    throw new Error(errorBody.error || errorBody.message || "Registration failed");
  }

  return { success: true };
}

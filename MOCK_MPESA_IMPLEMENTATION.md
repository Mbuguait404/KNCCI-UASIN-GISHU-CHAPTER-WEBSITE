# Mock M-Pesa Payment Implementation

This document describes the mock M-Pesa payment system implemented for demonstration purposes.

## Overview

The mock M-Pesa service simulates the complete M-Pesa STK Push payment flow without making actual API calls to Safaricom's M-Pesa API. This allows for testing and demonstration of the ticket purchasing flow without requiring actual payment endpoints.

## Features

### 1. **Phone Number Validation**
- Validates Kenyan phone number formats:
  - `254712345678` (international format)
  - `0712345678` (local format)
  - `+254712345678` (with country code)
- Automatically normalizes phone numbers to `254` format

### 2. **Payment Flow Simulation**
The mock service simulates a realistic M-Pesa payment flow:

1. **Initiation Phase** (0-3 seconds)
   - Validates phone number and amount
   - Generates mock checkout request ID
   - Returns success response

2. **Processing Phase** (3-8 seconds)
   - Simulates user receiving STK push
   - Simulates user entering PIN
   - Shows "processing" status

3. **Completion Phase** (8+ seconds)
   - 90% success rate (simulates successful payment)
   - 10% failure rate (simulates various failure scenarios)
   - Generates mock transaction ID

### 3. **Status Updates**
The service provides real-time status updates during payment processing:
- `pending`: Payment request sent, waiting for customer action
- `processing`: Customer has entered PIN, processing payment
- `completed`: Payment successful
- `failed`: Payment failed (various reasons)

## File Structure

### `client/src/lib/mock-mpesa.ts`
Contains the mock M-Pesa service implementation:
- `initiateMockMpesaPayment()`: Initiates STK push
- `checkMockMpesaPaymentStatus()`: Checks payment status
- `processMockMpesaPayment()`: Complete payment flow handler

### `client/src/components/registration-dialog.tsx`
Updated registration dialog that:
- Shows phone number input for paid tickets
- Integrates mock M-Pesa service
- Handles both free and paid ticket flows
- Provides real-time payment status updates

## Usage Flow

### Free Tickets (Regular Admission)
1. User selects free tickets
2. User fills checkout form
3. Purchase is created immediately (mocked)
4. User sees success screen

### Paid Tickets (Gala Night)
1. User selects paid tickets (e.g., Gala Night - KES 1,500)
2. User fills checkout form
3. User is taken to payment step
4. User enters M-Pesa phone number
5. User clicks "Pay with M-Pesa"
6. System simulates STK push:
   - Shows "Check your phone" message
   - Updates status: pending → processing → completed
7. After successful payment:
   - Purchase is created (mocked)
   - User sees success screen with ticket confirmation

## Payment Status Messages

### Pending
- "We've sent an M-PESA prompt to your number. Please check your phone."

### Processing
- "You've entered your PIN. Processing your payment..."

### Completed
- "Payment Successful! Your payment has been confirmed. Generating your tickets..."

### Failed
- Various failure messages:
  - "Insufficient funds"
  - "Transaction cancelled by user"
  - "Invalid PIN entered"
  - "Transaction timeout"

## Mock Behavior

### Success Rate
- 90% of payments succeed (for realistic demo)
- 10% fail with various error messages

### Timing
- Initial request: ~800ms delay
- Status checks: ~500ms delay
- Payment completion: 8-30 seconds (simulates real M-Pesa timing)

### Mock IDs Generated
- Checkout Request ID: `ws_CO_{timestamp}_{random}`
- Merchant Request ID: `MERCHANT_{timestamp}_{random}`
- Transaction ID: `MPX{timestamp}{random}`

## Integration Points

### Registration Dialog Changes
1. **Phone Number Input**: Added for paid tickets
2. **Payment Handler**: `handleMpesaPayment()` function
3. **Status Updates**: Real-time payment status display
4. **Free vs Paid**: Different flows based on `totalAmount`

### Key Functions

#### `handleSubmitOrder()`
- Handles form submission
- For free tickets: Creates purchase immediately
- For paid tickets: Stores data and proceeds to payment step

#### `handleMpesaPayment()`
- Validates phone number
- Calls `processMockMpesaPayment()`
- Handles payment status updates
- Creates purchase after successful payment
- Shows success/error messages

## Testing Scenarios

### Successful Payment Flow
1. Select paid ticket (e.g., Gala Night)
2. Fill checkout form
3. Enter phone number: `0712345678`
4. Click "Pay with M-Pesa"
5. Wait for payment processing (8-10 seconds)
6. See success message

### Failed Payment Flow
- Occasionally payments will fail (10% chance)
- User sees error message
- Can retry payment

### Free Ticket Flow
1. Select free ticket (General Admission)
2. Fill checkout form
3. Immediately see success (no payment step)

## Future Enhancements

If you want to switch to real M-Pesa integration:

1. Replace `processMockMpesaPayment()` calls with real API calls
2. Update `client/src/lib/mock-mpesa.ts` to call actual M-Pesa endpoints
3. Update server routes to handle M-Pesa callbacks
4. Implement webhook handlers for payment confirmations

## Notes

- The mock service is designed for demonstration purposes only
- All payment processing is simulated client-side
- No actual money is transferred
- Purchase IDs are generated locally (not from actual API)
- The system handles both free and paid events seamlessly


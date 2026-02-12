/**
 * Mock M-Pesa Payment Service
 * 
 * This service simulates the M-Pesa STK Push payment flow for demonstration purposes.
 * It mimics the real M-Pesa API behavior without making actual API calls.
 */

export interface MockMpesaPaymentRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
  purchaseId?: string;
}

export interface MockMpesaPaymentResponse {
  success: boolean;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  responseCode?: string;
  responseDescription?: string;
  customerMessage?: string;
  errorMessage?: string;
}

export interface MockMpesaPaymentStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  checkoutRequestId: string;
  resultCode?: string;
  resultDesc?: string;
  transactionId?: string;
  amount?: number;
  phoneNumber?: string;
}

/**
 * Validates a Kenyan phone number format
 */
function validatePhoneNumber(phone: string): boolean {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '');
  
  // Check if it starts with 254, 0, or +254
  const patterns = [
    /^254\d{9}$/,      // 254712345678
    /^0\d{9}$/,        // 0712345678
    /^\+254\d{9}$/,    // +254712345678
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
}

/**
 * Normalizes phone number to 254 format
 */
function normalizePhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '');
  
  if (cleaned.startsWith('+254')) {
    return cleaned.substring(1);
  } else if (cleaned.startsWith('254')) {
    return cleaned;
  } else if (cleaned.startsWith('0')) {
    return '254' + cleaned.substring(1);
  }
  
  return cleaned;
}

/**
 * Simulates initiating an M-Pesa STK Push payment
 * 
 * This function simulates:
 * 1. Validating the phone number
 * 2. Sending STK push request
 * 3. Returning a checkout request ID
 */
export async function initiateMockMpesaPayment(
  request: MockMpesaPaymentRequest
): Promise<MockMpesaPaymentResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Validate phone number
  if (!validatePhoneNumber(request.phoneNumber)) {
    return {
      success: false,
      errorMessage: 'Invalid phone number format. Please use format: 0712345678 or 254712345678',
      responseCode: '400',
      responseDescription: 'Invalid phone number',
    };
  }

  // Validate amount
  if (request.amount <= 0) {
    return {
      success: false,
      errorMessage: 'Amount must be greater than 0',
      responseCode: '400',
      responseDescription: 'Invalid amount',
    };
  }

  // Simulate occasional failures (5% failure rate for demo)
  const shouldFail = Math.random() < 0.05;
  if (shouldFail) {
    return {
      success: false,
      errorMessage: 'Unable to process payment request. Please try again.',
      responseCode: '500',
      responseDescription: 'Service temporarily unavailable',
    };
  }

  // Generate mock IDs
  const checkoutRequestId = `ws_CO_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const merchantRequestId = `MERCHANT_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  return {
    success: true,
    checkoutRequestId,
    merchantRequestId,
    responseCode: '0',
    responseDescription: 'Success. Request accepted for processing',
    customerMessage: `STK Push sent to ${normalizePhoneNumber(request.phoneNumber)}. Please check your phone and enter your M-Pesa PIN.`,
  };
}

/**
 * Simulates checking the status of an M-Pesa payment
 * 
 * This function simulates polling for payment status and returns
 * different states based on elapsed time.
 */
export async function checkMockMpesaPaymentStatus(
  checkoutRequestId: string,
  startTime: number
): Promise<MockMpesaPaymentStatus> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const elapsedSeconds = (Date.now() - startTime) / 1000;

  // Simulate payment flow:
  // - 0-3 seconds: pending
  // - 3-8 seconds: processing (user entering PIN)
  // - 8+ seconds: completed (or failed if timeout)

  if (elapsedSeconds < 3) {
    return {
      status: 'pending',
      checkoutRequestId,
      resultCode: '0',
      resultDesc: 'Request received, waiting for customer action',
    };
  }

  if (elapsedSeconds < 8) {
    return {
      status: 'processing',
      checkoutRequestId,
      resultCode: '0',
      resultDesc: 'Customer has entered PIN, processing payment',
    };
  }

  // After 8 seconds, simulate completion (90% success rate)
  const isSuccess = Math.random() < 0.9;

  if (isSuccess) {
    const transactionId = `MPX${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return {
      status: 'completed',
      checkoutRequestId,
      resultCode: '0',
      resultDesc: 'The service request is processed successfully',
      transactionId,
      amount: 0, // Will be set by caller
      phoneNumber: '', // Will be set by caller
    };
  } else {
    // Simulate failure scenarios
    const failureReasons = [
      'Insufficient funds',
      'Transaction cancelled by user',
      'Invalid PIN entered',
      'Transaction timeout',
    ];
    const randomReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];

    return {
      status: 'failed',
      checkoutRequestId,
      resultCode: '1032',
      resultDesc: randomReason,
    };
  }
}

/**
 * Simulates the complete M-Pesa payment flow
 * 
 * This function handles the entire payment process:
 * 1. Initiates STK push
 * 2. Waits for user to complete payment
 * 3. Polls for payment status
 * 4. Returns final result
 */
export async function processMockMpesaPayment(
  request: MockMpesaPaymentRequest,
  onStatusUpdate?: (status: MockMpesaPaymentStatus) => void
): Promise<{ success: boolean; status: MockMpesaPaymentStatus; error?: string }> {
  // Step 1: Initiate STK Push
  const initResponse = await initiateMockMpesaPayment(request);
  
  if (!initResponse.success || !initResponse.checkoutRequestId) {
    return {
      success: false,
      status: {
        status: 'failed',
        checkoutRequestId: '',
        resultDesc: initResponse.errorMessage || 'Failed to initiate payment',
      },
      error: initResponse.errorMessage,
    };
  }

  const checkoutRequestId = initResponse.checkoutRequestId;
  const startTime = Date.now();
  const maxWaitTime = 30000; // 30 seconds max wait
  const pollInterval = 2000; // Poll every 2 seconds

  // Step 2: Poll for payment status
  return new Promise((resolve) => {
    const pollStatus = async () => {
      const elapsed = Date.now() - startTime;

      if (elapsed > maxWaitTime) {
        resolve({
          success: false,
          status: {
            status: 'failed',
            checkoutRequestId,
            resultCode: '1032',
            resultDesc: 'Payment timeout. Please try again.',
          },
          error: 'Payment timeout',
        });
        return;
      }

      const status = await checkMockMpesaPaymentStatus(checkoutRequestId, startTime);
      
      // Update status callback
      if (onStatusUpdate) {
        onStatusUpdate(status);
      }

      if (status.status === 'completed') {
        resolve({
          success: true,
          status: {
            ...status,
            amount: request.amount,
            phoneNumber: normalizePhoneNumber(request.phoneNumber),
          },
        });
      } else if (status.status === 'failed' || status.status === 'cancelled') {
        resolve({
          success: false,
          status,
          error: status.resultDesc || 'Payment failed',
        });
      } else {
        // Continue polling
        setTimeout(pollStatus, pollInterval);
      }
    };

    // Start polling after initial delay
    setTimeout(pollStatus, pollInterval);
  });
}


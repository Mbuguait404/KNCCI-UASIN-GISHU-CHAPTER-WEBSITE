/**
 * Web3Forms utility for form submissions
 * Documentation: https://docs.web3forms.com
 */

interface Web3FormsSubmission {
  access_key: string;
  subject?: string;
  from_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  [key: string]: any; // Allow additional custom fields
}

interface Web3FormsResponse {
  success: boolean;
  message: string;
}

/**
 * Submit form data to Web3Forms
 * @param data - Form data to submit
 * @param subject - Optional email subject line
 * @returns Promise with submission result
 */
export async function submitToWeb3Forms(
  data: Record<string, any>,
  subject?: string
): Promise<Web3FormsResponse> {
  // Try to get access key from environment variable
  let accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  // Debug logging (remove in production if needed)
  if (import.meta.env.DEV) {
    console.log("Environment check:", {
      hasAccessKey: !!accessKey,
      accessKeyLength: accessKey?.length || 0,
      allEnvKeys: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')),
      envMode: import.meta.env.MODE
    });
  }

  // Fallback: Use hardcoded key if env var is not available (for development/testing)
  // Remove this fallback in production!
  if (!accessKey) {
    accessKey = "14fe75e0-a040-4503-9e6b-eb1eeeb313d9";
    console.warn(
      "⚠️ Using fallback Web3Forms access key. " +
      "Please set VITE_WEB3FORMS_ACCESS_KEY in client/.env file and restart the dev server."
    );
  }

  if (!accessKey) {
    const errorMessage = 
      "Web3Forms access key is not configured. " +
      "Please ensure VITE_WEB3FORMS_ACCESS_KEY is set in your client/.env file " +
      "and restart your development server.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const submissionData: Web3FormsSubmission = {
    access_key: accessKey,
    ...data,
  };

  if (subject) {
    submissionData.subject = subject;
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(submissionData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to submit form");
    }

    return {
      success: result.success || false,
      message: result.message || "Form submitted successfully",
    };
  } catch (error) {
    console.error("Web3Forms submission error:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to submit form. Please try again later.");
  }
}

/**
 * Format form data for Web3Forms submission
 * Converts form data into a readable format for email
 */
export function formatFormDataForEmail(data: Record<string, any>): string {
  // Define a mapping for better field names
  const fieldLabels: Record<string, string> = {
    name: "Contact Person Name",
    email: "Email Address",
    phone: "Phone Number",
    company_name: "Company Name",
    contact_person: "Contact Person",
    member_type: "Member Type",
    member_name: "Member Name",
    member_email: "Member Email",
    price_per_booth: "Price Per Booth",
    booth_count: "Number of Booths",
    booth_type: "Booth Type",
    booth_dimensions: "Booth Dimensions",
    booth_total_sqm: "Total Square Meters",
    booth_description: "Booth Selection",
    total_amount: "Total Amount",
    additional_requirements: "Additional Requirements",
  };

  // Priority order for important fields
  const priorityFields = [
    "company_name",
    "contact_person",
    "name",
    "email",
    "phone",
    "member_type",
    "member_name",
    "member_email",
    "booth_description",
    "booth_type",
    "booth_dimensions",
    "booth_total_sqm",
    "booth_count",
    "price_per_booth",
    "total_amount",
    "additional_requirements",
  ];

  // Format fields with priority order
  const formattedLines: string[] = [];
  
  // Add priority fields first
  priorityFields.forEach((key) => {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
      const label = fieldLabels[key] || key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      formattedLines.push(`${label}: ${data[key]}`);
    }
  });

  // Add any remaining fields not in priority list
  Object.entries(data).forEach(([key, value]) => {
    if (!priorityFields.includes(key) && value !== undefined && value !== null && value !== "") {
      const label = fieldLabels[key] || key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      formattedLines.push(`${label}: ${value}`);
    }
  });

  return formattedLines.join("\n");
}

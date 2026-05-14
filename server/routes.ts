
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema, insertNewsletterSchema, insertSponsorRequestSchema, insertContactSubmissionSchema, insertMembershipApplicationSchema } from "@shared/schema";
import { BUSINESS_CATEGORIES, BUSINESS_PLANS } from "@shared/business-categories";
import { TicketingService } from "./services/ticketing";
import ExcelJS from "exceljs";
import xlsx from "xlsx";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const CMS_API_BASE_URL =
  process.env.CMS_API_URL ||
  process.env.VITE_CMS_API_URL ||
  "https://print-shop-api.vercel.app";
const CMS_TENANT_ID =
  process.env.CMS_TENANT_ID ||
  "69e37354ae0d3b8019eb1625";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Event data endpoints
  app.get("/api/event", (req, res) => {
    const event = storage.getEvent();
    res.json(event);
  });

  // Ticketing API Proxy Endpoints - proxy to external ticketing API
  app.get("/api/ticketing/events", async (req, res) => {
    try {
      const data = await TicketingService.getEvent(req.query.id as string);
      res.json(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch event data";
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get("/api/ticketing/ticket-types", async (req, res) => {
    try {
      const eventId = req.query.eventId as string;
      if (!eventId) {
        return res.status(400).json({ error: "eventId is required" });
      }
      const data = await TicketingService.getTicketTypes(eventId);
      res.json(data);
    } catch (error) {
      console.error("Error fetching ticket types:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch ticket types";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Purchase endpoint - proxies to external ticketing API
  app.post("/api/ticketing/purchases", async (req, res) => {
    try {
      const purchaseData = req.body;

      // Validate required fields
      if (!purchaseData.eventId) {
        return res.status(400).json({ error: "eventId is required" });
      }
      if (!purchaseData.ticketItems || !Array.isArray(purchaseData.ticketItems) || purchaseData.ticketItems.length === 0) {
        return res.status(400).json({ error: "ticketItems array is required and must not be empty" });
      }
      if (!purchaseData.paymentMethod) {
        return res.status(400).json({ error: "paymentMethod is required" });
      }

      const data = await TicketingService.createPurchase(purchaseData);
      res.json(data);
    } catch (error) {
      console.error("Error creating purchase:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create purchase";
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get("/api/speakers", (req, res) => {
    const speakers = storage.getSpeakers();
    res.json(speakers);
  });

  app.get("/api/schedule", (req, res) => {
    const schedule = storage.getSchedule();
    res.json(schedule);
  });

  app.get("/api/partners", (req, res) => {
    const partners = storage.getPartners();
    res.json(partners);
  });

  app.get("/api/gallery", (req, res) => {
    const gallery = storage.getGalleryImages();
    res.json(gallery);
  });

  app.get("/api/testimonials", (req, res) => {
    const testimonials = storage.getTestimonials();
    res.json(testimonials);
  });

  app.get("/api/advertisements/active", async (req, res) => {
    try {
      const placement =
        typeof req.query.placement === "string" && req.query.placement.trim()
          ? req.query.placement.trim()
          : "homepage";

      const cmsResponse = await fetch(
        `${CMS_API_BASE_URL}/advertisements/active?placement=${encodeURIComponent(placement)}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-tenant-id": CMS_TENANT_ID,
          },
        },
      );

      const responseText = await cmsResponse.text();
      let responseData: unknown;
      try {
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch {
        responseData = responseText || null;
      }

      if (!cmsResponse.ok) {
        console.error("[Advertisement] CMS proxy error:", cmsResponse.status, responseData);
        return res.status(cmsResponse.status).json(
          typeof responseData === "object" && responseData !== null
            ? responseData
            : { message: "Failed to fetch advertisement." },
        );
      }

      res.json(responseData);
    } catch (error) {
      console.error("[Advertisement] Proxy request failed:", error);
      res.status(500).json({ message: "Failed to fetch advertisement." });
    }
  });

  app.get("/api/venue", (req, res) => {
    const venue = storage.getVenue();
    res.json(venue);
  });

  // Registration endpoint - proxies to KNCCI messaging (same as api/index.ts for Vercel)
  const KNCCI_MESSAGING_URL =
    process.env.KNCCI_MESSAGING_URL ||
    "https://kncci-messaging.onrender.com/notifications/event-registration/sendgrid";
  const UNIFLOW_BASE_URL =
    process.env.UNIFLOW_BASE_URL || "https://smsapi.solby.io:8443";
  const UNIFLOW_API_KEY = process.env.UNIFLOW_API_KEY;

  app.post("/api/registration", async (req, res) => {
    try {
      const payload = req.body;
      if (!payload?.event?.id || !payload?.attendee?.email || !Array.isArray(payload?.tickets) || payload.tickets.length === 0) {
        return res.status(400).json({ error: "Invalid registration payload: event, attendee, and tickets required" });
      }

      const kncciResponse = await fetch(KNCCI_MESSAGING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseText = await kncciResponse.text();
      let responseData: unknown;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch {
        responseData = { message: responseText };
      }

      if (!kncciResponse.ok) {
        console.error("[Registration] KNCCI proxy error:", kncciResponse.status, responseData);
        return res.status(kncciResponse.status).json(
          typeof responseData === "object" && responseData !== null && "error" in (responseData as object)
            ? responseData
            : { error: "Registration service error", details: responseData }
        );
      }

      res.status(kncciResponse.status).json(
        typeof responseData === "object" && responseData !== null ? responseData : { success: true }
      );
    } catch (error) {
      console.error("Error in /api/registration:", error);
      res.status(500).json({ error: "Failed to create registration" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const { to, type, message, subject } = req.body ?? {};

      if (!to || typeof to !== "string") {
        return res.status(400).json({ error: "Recipient is required" });
      }
      if (type !== "sms" && type !== "email") {
        return res.status(400).json({ error: "Notification type must be sms or email" });
      }
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }
      if (type === "email" && subject !== undefined && typeof subject !== "string") {
        return res.status(400).json({ error: "Email subject must be a string" });
      }
      if (!UNIFLOW_API_KEY) {
        return res.status(500).json({ error: "Notification service is not configured" });
      }

      const providerPayload: Record<string, unknown> = {
        to,
        type,
        message,
        attachments: [],
      };
      if (type === "email" && subject) {
        providerPayload.subject = subject;
      }

      const providerResponse = await fetch(
        `${UNIFLOW_BASE_URL}/notifications/send?apikey=${encodeURIComponent(UNIFLOW_API_KEY)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(providerPayload),
        },
      );

      const responseText = await providerResponse.text();
      let responseData: unknown;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch {
        responseData = { message: responseText };
      }

      if (!providerResponse.ok) {
        console.error("[Notifications] Provider error:", providerResponse.status, responseData);
        return res.status(providerResponse.status).json(
          typeof responseData === "object" && responseData !== null
            ? responseData
            : { error: "Notification service error" },
        );
      }

      res.status(providerResponse.status).json(
        typeof responseData === "object" && responseData !== null
          ? responseData
          : { success: true },
      );
    } catch (error) {
      console.error("Error in /api/notifications:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // Legacy registration endpoint (plural)
  app.post("/api/registrations", async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      const registration = await storage.createRegistration(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid registration data" });
      }
    }
  });

  app.get("/api/registrations", async (req, res) => {
    const registrations = await storage.getRegistrations();
    res.json(registrations);
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.subscribeNewsletter(validatedData);
      res.status(201).json(subscription);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid email" });
      }
    }
  });

  app.get("/api/newsletter", async (req, res) => {
    const subscriptions = await storage.getNewsletterSubscriptions();
    res.json(subscriptions);
  });

  // Sponsor / partnership interest endpoint
  app.post("/api/sponsor-requests", async (req, res) => {
    try {
      const validatedData = insertSponsorRequestSchema.parse(req.body);
      const request = await storage.createSponsorRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid sponsor request data" });
      }
    }
  });

  app.get("/api/sponsor-requests", async (req, res) => {
    const requests = await storage.getSponsorRequests();
    res.json(requests);
  });

  // Contact submissions endpoint
  const KNCCI_API_BASE_URL = process.env.KNCCI_API_BASE_URL || "http://localhost:4000/api/v1";

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);

      // Forward to main API
      const apiResponse = await fetch(`${KNCCI_API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      const responseText = await apiResponse.text();
      let responseData: unknown;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch {
        responseData = { message: responseText };
      }

      if (!apiResponse.ok) {
        console.error("[Contact] API proxy error:", apiResponse.status, responseData);
        return res.status(apiResponse.status).json(
          typeof responseData === "object" && responseData !== null && "error" in (responseData as object)
            ? responseData
            : { error: "Contact service error", details: responseData }
        );
      }

      // Also save locally to mem storage for backup
      const submission = await storage.createContactSubmission(validatedData);

      res.status(201).json({
        ...submission,
        remoteResponse: responseData
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid contact submission data" });
      }
    }
  });

  app.get("/api/contact", async (req, res) => {
    const submissions = await storage.getContactSubmissions();
    res.json(submissions);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // ── BULK BUSINESS IMPORT ────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  app.get("/api/admin/businesses/import-template", async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const validCategories = [...BUSINESS_CATEGORIES];
    const validSubCounties = ["Turbo", "Kesses", "Moiben", "Kapseret", "Ainabkoi", "Soy"];
    const validSubscriptionFees = [
      "Sole Proprietor (Sub-Urban) (Kshs. 3,000)",
      "Sole Proprietor (Urban) (Kshs. 6,000)",
      "Partnership (Kshs. 8,000)",
      "Business Associates/Groups (Kshs 8,000)",
      "SME Private Limited Company (Kshs. 12,000)",
      "Hotels (Ksh. 15,000)",
      "Travel and Education Agencies (Kshs. 25,000)",
      "Local Private Limited Companies (Kshs. 25,000)",
      "Large Corporates (Kshs 50,000)",
      "State Corporations (Kshs 100,000)",
      "International Organization (Kshs. 100,000)",
      "Patron Members (Kshs. 100,000)",
    ];

    const headers = ["name", "businessName", "email", "contact", "location", "subCounty", "businessClass", "subscriptionFee"];
    const example = [
      "John Doe",
      "Acme Corp Ltd",
      "info@acme.com",
      "+254700000000",
      "Eldoret",
      "Kapseret",
      "Information Technology",
      "SME Private Limited Company (Kshs. 12,000)",
    ];

    const businessSheet = workbook.addWorksheet("Businesses");
    businessSheet.addRow(headers);
    businessSheet.addRow(example);
    businessSheet.views = [{ state: "frozen", ySplit: 1 }];
    businessSheet.columns = headers.map((header) => ({ header, key: header, width: 24 }));

    const headerRow = businessSheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF3F4F6" },
    };

    const valuesSheet = workbook.addWorksheet("Valid Values");
    valuesSheet.columns = [
      { header: "VALID CATEGORIES (businessClass)", key: "category", width: 42 },
      { header: "VALID SUB-COUNTIES (subCounty)", key: "subCounty", width: 20 },
      { header: "VALID SUBSCRIPTION FEES (subscriptionFee)", key: "fee", width: 50 },
    ];
    valuesSheet.getRow(1).font = { bold: true };
    const maxLen = Math.max(validCategories.length, validSubCounties.length, validSubscriptionFees.length);
    for (let i = 0; i < maxLen; i++) {
      valuesSheet.addRow({
        category: validCategories[i] || "",
        subCounty: validSubCounties[i] || "",
        fee: validSubscriptionFees[i] || "",
      });
    }

    const instructionsSheet = workbook.addWorksheet("Instructions");
    instructionsSheet.columns = [{ header: "Instructions", key: "instruction", width: 90 }];
    [
      "HOW TO USE THIS TEMPLATE - Bulk Membership Application Import",
      "",
      "1. Go to the 'Businesses' sheet and fill in each row under the column headers.",
      "",
      "2. REQUIRED FIELDS (must be filled for each row):",
      "   - name — Full name of the business owner/representative",
      "   - businessName — Registered business/organization name",
      "   - email — Valid email address for the applicant",
      "   - contact — Phone number with country code, e.g. +254700000000",
      "   - location — Town/City, e.g. Eldoret",
      "   - subCounty — Use the dropdown or pick from the 'Valid Values' sheet",
      "   - businessClass — Use the dropdown or pick from the 'Valid Values' sheet",
      "   - subscriptionFee — Use the dropdown or pick from the 'Valid Values' sheet",
      "",
      "3. Copy values EXACTLY from the 'Valid Values' sheet. Invalid values will be rejected.",
      "",
      "4. After filling, save as .xlsx and upload using the Bulk Import tab in Admin.",
      "",
      "5. Submitted applications will appear in the 'Applications' tab for admin approval.",
    ].forEach((instruction) => instructionsSheet.addRow([instruction]));

    const categoryFormula = `'Valid Values'!$A$2:$A$${validCategories.length + 1}`;
    const subCountyFormula = `'Valid Values'!$B$2:$B$${validSubCounties.length + 1}`;
    const feeFormula = `'Valid Values'!$C$2:$C$${validSubscriptionFees.length + 1}`;

    // businessClass = column G (7th column)
    for (let row = 2; row <= 500; row++) {
      businessSheet.getCell(`G${row}`).dataValidation = {
        type: "list",
        allowBlank: row !== 2,
        formulae: [categoryFormula],
        showErrorMessage: true,
        errorTitle: "Invalid category",
        error: "Please choose a value from the dropdown list.",
      };
    }

    // subCounty = column F (6th column)
    for (let row = 2; row <= 500; row++) {
      businessSheet.getCell(`F${row}`).dataValidation = {
        type: "list",
        allowBlank: row !== 2,
        formulae: [subCountyFormula],
        showErrorMessage: true,
        errorTitle: "Invalid sub-county",
        error: "Please choose a value from the dropdown list.",
      };
    }

    // subscriptionFee = column H (8th column)
    for (let row = 2; row <= 500; row++) {
      businessSheet.getCell(`H${row}`).dataValidation = {
        type: "list",
        allowBlank: row !== 2,
        formulae: [feeFormula],
        showErrorMessage: true,
        errorTitle: "Invalid subscription fee",
        error: "Please choose a value from the dropdown list.",
      };
    }

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=kncci_membership_applications_template.xlsx");
    res.send(buffer);
  });

  app.post("/api/admin/businesses/bulk-import", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows: any[] = xlsx.utils.sheet_to_json(worksheet);

      if (rows.length === 0) {
        return res.status(400).json({ success: false, message: "Spreadsheet is empty" });
      }

      const validCategories = [...BUSINESS_CATEGORIES];
      const validSubCounties = ["Turbo", "Kesses", "Moiben", "Kapseret", "Ainabkoi", "Soy"];
      const validSubscriptionFees = [
        "Sole Proprietor (Sub-Urban) (Kshs. 3,000)",
        "Sole Proprietor (Urban) (Kshs. 6,000)",
        "Partnership (Kshs. 8,000)",
        "Business Associates/Groups (Kshs 8,000)",
        "SME Private Limited Company (Kshs. 12,000)",
        "Hotels (Ksh. 15,000)",
        "Travel and Education Agencies (Kshs. 25,000)",
        "Local Private Limited Companies (Kshs. 25,000)",
        "Large Corporates (Kshs 50,000)",
        "State Corporations (Kshs 100,000)",
        "International Organization (Kshs. 100,000)",
        "Patron Members (Kshs. 100,000)",
      ];
      const requiredFields = ["name", "businessName", "email", "contact", "location", "subCounty", "businessClass", "subscriptionFee"];
      const imported: any[] = [];
      const errors: { row: number; message: string }[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNum = i + 2;

        const missingFields = requiredFields.filter(f => !row[f]);
        if (missingFields.length > 0) {
          errors.push({ row: rowNum, message: `Missing required fields: ${missingFields.join(", ")}` });
          continue;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
          errors.push({ row: rowNum, message: `Invalid email format: ${row.email}` });
          continue;
        }

        if (!validCategories.includes(row.businessClass)) {
          errors.push({ row: rowNum, message: `Invalid businessClass "${row.businessClass}". See "Valid Values" sheet.` });
          continue;
        }

        if (!validSubCounties.includes(row.subCounty)) {
          errors.push({ row: rowNum, message: `Invalid subCounty "${row.subCounty}". Must be: ${validSubCounties.join(", ")}` });
          continue;
        }

        if (!validSubscriptionFees.includes(row.subscriptionFee)) {
          errors.push({ row: rowNum, message: `Invalid subscriptionFee "${row.subscriptionFee}".` });
          continue;
        }

        const appData = {
          name: row.name,
          businessName: row.businessName,
          email: row.email,
          contact: String(row.contact),
          location: row.location,
          subCounty: row.subCounty,
          businessClass: row.businessClass,
          subscriptionFee: row.subscriptionFee,
        };

        try {
          const authHeader = req.headers.authorization;
          const apiResponse = await fetch(`${KNCCI_API_BASE_URL}/membership-applications`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(authHeader ? { "Authorization": authHeader } : {}),
            },
            body: JSON.stringify(appData),
          });

          if (!apiResponse.ok) {
            const errBody = await apiResponse.text();
            errors.push({ row: rowNum, message: errBody || apiResponse.statusText });
          } else {
            imported.push(appData);
          }
        } catch (err: any) {
          errors.push({ row: rowNum, message: `Request failed: ${err.message}` });
        }
      }

      res.json({
        success: true,
        data: {
          imported: imported.length,
          failed: errors.length,
          errors,
        },
        message: `Created ${imported.length} membership applications, ${errors.length} failed.`,
      });
    } catch (error: any) {
      console.error("Bulk import error:", error);
      res.status(500).json({ success: false, message: error.message || "Bulk import failed" });
    }
  });

  return httpServer;
}

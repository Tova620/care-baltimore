const {setGlobalOptions} = require("firebase-functions");
const {onDocumentWritten} = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const {google} = require("googleapis");

// Limit concurrent instances (from your template)
setGlobalOptions({maxInstances: 10});

// Google Sheet IDs
const VISITOR_SHEET_ID = "1J8P6hoN81akdJGgAKFiraUy9-znTd_XzQ-kAZy_soj0";
const VOLUNTEER_SHEET_ID = "1FEAg9tbecNAf_oyqCpOk_Nssby0x6WAQIkcGFFEdPbM";
const VISIT_LOG_SHEET_ID = "1sByoitmBIcrvFCknNyC8lM1Fz5nFx3q1iPRl_7X560k";

/**
 * Trigger whenever a document in visitRequests is created/updated/deleted
 * Path: visitRequests/{docId}
 */
exports.visitorSignupToSheet = onDocumentWritten(
    "visitRequests/{docId}",
    async (event) => {
      const docId = event.params.docId;

      // If the document was deleted, skip
      if (!event.data.after.exists) {
        logger.info(`Document ${docId} deleted, not appending to sheet.`);
        return;
      }

      const data = event.data.after.data() || {};

      // Handle Firestore timestamp for submittedAt
      let submittedAtIso;
      if (data.submittedAt && typeof data.submittedAt.toDate === "function") {
        submittedAtIso = data.submittedAt.toDate().toISOString();
      } else {
        submittedAtIso = new Date().toISOString();
      }

      // preferredDays is an array; join into a string
      const preferredDays = Array.isArray(data.preferredDays) ?
      data.preferredDays.join(", ") :
      "";

      // Build the row in the specified order with timestamp in column A
      const row = [
        submittedAtIso, // A: Timestamp
        data.fullName || "", // B: Full Name
        data.address || "", // C: Address
        data.pointOfContact || "", // D: Point of Contact
        data.relationship || "", // E: Relationship
        data.phone || "", // F: Phone
        data.email || "", // G: Email
        data.gender || "", // H: Gender
        preferredDays, // I: Preferred Days
        data.agree ? "Yes" : "No", // J: Agreed
      ];

      // Auth with the service account you shared the sheet with
      const auth = new google.auth.GoogleAuth({
        keyFile: "./service-account-key.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      const authClient = await auth.getClient();

      const sheets = google.sheets({
        version: "v4",
        auth: authClient,
      });

      await sheets.spreadsheets.values.append({
        spreadsheetId: VISITOR_SHEET_ID,
        range: "A:J",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [row],
        },
      });

      logger.info("Appended visitor row:", row);
    },
);

/**
 * Trigger whenever a document in volunteers is created/updated/deleted
 * Path: volunteers/{docId}
 */
exports.volunteerSignupToSheet = onDocumentWritten(
    "volunteers/{docId}",
    async (event) => {
      const docId = event.params.docId;

      // If the document was deleted, skip
      if (!event.data.after.exists) {
        logger.info(`Document ${docId} deleted, not appending to sheet.`);
        return;
      }

      const data = event.data.after.data() || {};

      // Handle Firestore timestamp for submittedAt
      let submittedAtIso;
      if (data.submittedAt && typeof data.submittedAt.toDate === "function") {
        submittedAtIso = data.submittedAt.toDate().toISOString();
      } else {
        submittedAtIso = new Date().toISOString();
      }

      // volunteerPreferences and preferredDays are arrays; join into strings
      const volunteerPreferences = Array.isArray(data.volunteerPreferences) ?
      data.volunteerPreferences.join(", ") :
      "";
      
      const preferredDays = Array.isArray(data.preferredDays) ?
      data.preferredDays.join(", ") :
      "";

      // Build the row for volunteers in specified order
      const row = [
        data.fullName || "", // A: Full Name
        data.age || "", // B: Age
        data.gender || "", // C: Gender
        data.phone || "", // D: Phone
        data.email || "", // E: Email
        data.isStudent === true ? "Yes" : "No", // F: Is Student
        data.school || "", // G: School
        volunteerPreferences, // H: Volunteer Preferences
        preferredDays, // I: Preferred Days
        data.agree ? "Yes" : "No", // J: Agree
      ];

      // Auth with the service account
      const auth = new google.auth.GoogleAuth({
        keyFile: "./service-account-key.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      const authClient = await auth.getClient();

      const sheets = google.sheets({
        version: "v4",
        auth: authClient,
      });

      await sheets.spreadsheets.values.append({
        spreadsheetId: VOLUNTEER_SHEET_ID,
        range: "A:J",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [row],
        },
      });

      logger.info("Appended volunteer row:", row);
    },
);

/**
 * Trigger whenever a document in visitLogs is created/updated/deleted
 * Path: visitLogs/{docId}
 */
exports.visitLogToSheet = onDocumentWritten(
    "visitLogs/{docId}",
    async (event) => {
      const docId = event.params.docId;

      // If the document was deleted, skip
      if (!event.data.after.exists) {
        logger.info(`Document ${docId} deleted, not appending to sheet.`);
        return;
      }

      const data = event.data.after.data() || {};

      // Handle Firestore timestamp for submittedAt
      let submittedAtIso;
      if (data.submittedAt && typeof data.submittedAt.toDate === "function") {
        submittedAtIso = data.submittedAt.toDate().toISOString();
      } else {
        submittedAtIso = new Date().toISOString();
      }

      // Handle visitDate
      let visitDateFormatted;
      if (data.visitDate) {
        if (typeof data.visitDate.toDate === "function") {
          visitDateFormatted = data.visitDate.toDate().toLocaleDateString();
        } else if (data.visitDate instanceof Date) {
          visitDateFormatted = data.visitDate.toLocaleDateString();
        } else {
          visitDateFormatted = new Date(data.visitDate).toLocaleDateString();
        }
      } else {
        visitDateFormatted = "";
      }

      // Build the row for visit logs
      const row = [
        submittedAtIso, // A: Timestamp
        data.email || "", // B: Volunteer Email
        data.name || "", // C: Volunteer Name
        data.visitedPerson || "", // D: Person Visited
        visitDateFormatted, // E: Visit Date
        data.notes || "", // F: Notes
      ];

      // Auth with the service account
      const auth = new google.auth.GoogleAuth({
        keyFile: "./service-account-key.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      const authClient = await auth.getClient();

      const sheets = google.sheets({
        version: "v4",
        auth: authClient,
      });

      await sheets.spreadsheets.values.append({
        spreadsheetId: VISIT_LOG_SHEET_ID,
        range: "A:F",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [row],
        },
      });

      logger.info("Appended visit log row:", row);
    },
);

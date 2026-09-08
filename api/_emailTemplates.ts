export interface BookingLead {
  id: string;
  timestamp: string;
  fullName: string;
  phone: string;
  email: string;
  serviceRequested: string;
  preferredDate?: string;
  babyDueDateOrBirthDate?: string;
  notes?: string;
  source: 'ai_poppy' | 'direct_form' | 'contact_page';
  transcript?: { sender: string; text: string; time: string }[];
}

export interface EmailTemplateData {
  lead: BookingLead;
  referenceNumber: string;
  timestamp: string;
}

const BRAND = {
  name: "Falguni's Photography",
  tagline: "Boutique Newborn, Maternity & Family Photography",
  address: "26 South Pkwy, Northfield SA 5085, Adelaide",
  phone: "+61 469 753 238",
  phoneRaw: "+61469753238",
  email: "cesaresmero2@gmail.com",
  website: "https://falgunicreativephotography.com.au",
  colors: {
    plum: "#423341",
    plumLight: "#5a4559",
    rose: "#EFD4CE",
    roseLight: "#FAF0ED",
    sage: "#52796F",
    sageLight: "#E8EFE9",
    cream: "#FBF6EF",
    gold: "#D4AF37",
    cardBg: "#FFFFFF"
  }
};

function formatServiceTitle(service?: string): string {
  if (!service) return "Boutique Photography Session";
  const s = service.toLowerCase();
  if (s.includes("newborn")) return "Newborn Photography Session";
  if (s.includes("maternity")) return "Maternity Photography Session";
  if (s.includes("family")) return "Family Photography Session";
  if (s.includes("cake")) return "Cake Smash & 1st Birthday Milestone";
  return service.charAt(0).toUpperCase() + service.slice(1) + " Session";
}

function escapeHtml(str?: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderClientBookingEmail(
  lead: BookingLead,
  referenceNumber: string,
  timestamp: string
): { subject: string; html: string; text: string } {
  const serviceTitle = formatServiceTitle(lead.serviceRequested);
  const clientName = escapeHtml(lead.fullName || "Valued Client");
  const displayPhone = escapeHtml(lead.phone || "Not provided (Email notification only)");
  const displayEmail = escapeHtml(lead.email || "Recorded");
  const displayDate = escapeHtml(lead.preferredDate || "Upcoming Session");
  const displayNotes = escapeHtml(lead.notes || "");

  const subject = `Your ${serviceTitle} Reservation Request - Falguni's Photography [${referenceNumber}]`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #FBF6EF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #423341;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #EFD4CE; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(66, 51, 65, 0.05);">
    <div style="background-color: #423341; padding: 28px 24px; text-align: center; color: #FBF6EF;">
      <h1 style="margin: 0 0 6px 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">${BRAND.name}</h1>
      <p style="margin: 0; font-size: 13px; color: #EFD4CE; text-transform: uppercase; letter-spacing: 1px;">${serviceTitle} Request</p>
    </div>

    <div style="padding: 28px 24px;">
      <p style="font-size: 16px; line-height: 24px; margin-top: 0; color: #423341;">
        Dear ${clientName},
      </p>
      <p style="font-size: 14px; line-height: 22px; color: #5a4559;">
        Thank you for reserving your portrait session with Falguni's Photography in Northfield, Adelaide. We have lovingly received your request, and Falguni will personally review her studio calendar and connect with you within 24 hours to finalize your session appointment.
      </p>

      <div style="background-color: #FAF0ED; border: 1px solid #EFD4CE; border-radius: 12px; padding: 18px 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #52796F; border-bottom: 1px solid #EFD4CE; padding-bottom: 6px;">
          Session Reservation Details
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 5px 0; color: #5a4559; width: 140px;"><strong>Reference:</strong></td>
            <td style="padding: 5px 0; color: #423341; font-weight: 600;">${referenceNumber}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #5a4559;"><strong>Session:</strong></td>
            <td style="padding: 5px 0; color: #423341; font-weight: 600;">${serviceTitle}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #5a4559;"><strong>Preferred Date:</strong></td>
            <td style="padding: 5px 0; color: #423341; font-weight: 600;">${displayDate}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #5a4559;"><strong>Client Name:</strong></td>
            <td style="padding: 5px 0; color: #423341;">${clientName}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #5a4559;"><strong>Phone:</strong></td>
            <td style="padding: 5px 0; color: #423341;">${displayPhone}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #5a4559;"><strong>Email:</strong></td>
            <td style="padding: 5px 0; color: #423341;">${displayEmail}</td>
          </tr>
          ${displayNotes ? `<tr><td style="padding: 5px 0; color: #5a4559; vertical-align: top;"><strong>Notes:</strong></td><td style="padding: 5px 0; color: #5a4559; font-style: italic;">"${displayNotes}"</td></tr>` : ''}
        </table>
      </div>

      <div style="background-color: #FBF6EF; border-radius: 12px; padding: 16px 18px; margin-bottom: 20px; font-size: 13px; line-height: 20px; color: #5a4559;">
        <strong style="color: #423341; display: block; margin-bottom: 4px;">Studio Location & Inclusions:</strong>
        26 South Pkwy, Northfield SA 5085, Adelaide. Our private boutique studio includes luxury couture wardrobe access, organic baby wraps, handcrafted headbands, floral props, and private off-street parking.
      </div>

      <p style="font-size: 13px; line-height: 20px; color: #5a4559; margin-bottom: 0;">
        Warmest regards,<br>
        <strong>Poppy & Falguni</strong><br>
        Falguni's Photography Studio<br>
        <a href="tel:+61469753238" style="color: #52796F; text-decoration: none;">+61 469 753 238</a>
      </p>
    </div>
  </div>
</body>
</html>`;

  const text = `FALGUNI'S PHOTOGRAPHY STUDIO RESERVATION
Reference: ${referenceNumber}
Client: ${clientName}
Service: ${serviceTitle}
Date: ${displayDate}
Phone: ${displayPhone}
Email: ${displayEmail}

Studio Address: 26 South Pkwy, Northfield SA 5085
Phone: +61 469 753 238
Website: https://falgunicreativephotography.com.au`;

  return { subject, html, text };
}

export function renderStudioLeadEmail(
  lead: BookingLead,
  referenceNumber: string,
  timestamp: string
): { subject: string; html: string; text: string } {
  const serviceTitle = formatServiceTitle(lead.serviceRequested);
  const clientName = escapeHtml(lead.fullName || "Valued Client");
  const displayPhone = escapeHtml(lead.phone || "Not provided (Email notification only)");
  const displayEmail = escapeHtml(lead.email || "Recorded");
  const displayDate = escapeHtml(lead.preferredDate || "Upcoming Session");
  const displayNotes = escapeHtml(lead.notes || "");

  const subject = `[NEW LEAD] ${serviceTitle} - ${clientName} [${referenceNumber}]`;

  const html = `<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; padding: 20px; background-color: #fbf6ef; color: #423341;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #efd4ce;">
    <h2 style="color: #423341; margin-top: 0;">New Studio Booking Request Received</h2>
    <p><strong>Reference:</strong> ${referenceNumber}</p>
    <p><strong>Client:</strong> ${clientName}</p>
    <p><strong>Service:</strong> ${serviceTitle}</p>
    <p><strong>Requested Date:</strong> ${displayDate}</p>
    <p><strong>Phone:</strong> <a href="tel:${displayPhone}">${displayPhone}</a></p>
    <p><strong>Email:</strong> <a href="mailto:${displayEmail}">${displayEmail}</a></p>
    ${displayNotes ? `<p><strong>Client Message/Notes:</strong> ${displayNotes}</p>` : ''}
    <p><strong>Timestamp:</strong> ${timestamp}</p>
  </div>
</body>
</html>`;

  const text = `NEW BOOKING LEAD
Reference: ${referenceNumber}
Client: ${clientName}
Service: ${serviceTitle}
Date: ${displayDate}
Phone: ${displayPhone}
Email: ${displayEmail}
Timestamp: ${timestamp}`;

  return { subject, html, text };
}

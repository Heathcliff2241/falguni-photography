import { BookingLead } from '../src/types';

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

/**
 * Format a service ID into a customer-friendly display title
 */
function formatServiceTitle(service?: string): string {
  if (!service) return "Boutique Photography Session";
  const s = service.toLowerCase();
  if (s.includes("newborn")) return "Newborn Photography Session";
  if (s.includes("maternity")) return "Maternity Photography Session";
  if (s.includes("family")) return "Family Photography Session";
  if (s.includes("cake")) return "Cake Smash & 1st Birthday Milestone";
  return service.charAt(0).toUpperCase() + service.slice(1) + " Session";
}

/**
 * Generates the responsive HTML email sent to the CLIENT confirming their booking request
 */
export function renderClientBookingEmail(lead: BookingLead, referenceNumber: string, timestamp: string): { subject: string; html: string; text: string } {
  const serviceTitle = formatServiceTitle(lead.serviceRequested);
  const subject = `✨ Booking Confirmation: Your ${serviceTitle} Request (Ref #${referenceNumber})`;
  const clientName = lead.fullName || "Valued Client";

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject}</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: ${BRAND.colors.cream}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; margin: auto !important; }
      .fluid-padding { padding: 20px 16px !important; }
      .grid-stack { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 0; background-color: ${BRAND.colors.cream};">
  <!-- Preheader text (hidden preview in inbox) -->
  <div style="display: none; font-size: 1px; color: ${BRAND.colors.cream}; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Thank you ${clientName}! Your session request for ${serviceTitle} has been received. Falguni will confirm your date within 24 hours.
  </div>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: auto;" class="email-container">
    
    <!-- Top Brand Header -->
    <tr>
      <td style="padding: 24px 32px 16px 32px; text-align: center; background-color: ${BRAND.colors.cardBg}; border-top-left-radius: 20px; border-top-right-radius: 20px; border: 1px solid ${BRAND.colors.rose}; border-bottom: none;">
        <div style="display: inline-block; padding: 4px 14px; background-color: ${BRAND.colors.roseLight}; border-radius: 20px; border: 1px solid ${BRAND.colors.rose}; margin-bottom: 8px;">
          <span style="font-size: 11px; font-weight: 700; color: ${BRAND.colors.sage}; text-transform: uppercase; letter-spacing: 1.5px;">Boutique Northfield Studio</span>
        </div>
        <h1 style="margin: 4px 0 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; line-height: 32px; color: ${BRAND.colors.plum}; font-weight: 400; letter-spacing: 0.5px;">
          ${BRAND.name}
        </h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: ${BRAND.colors.plumLight};">
          ${BRAND.tagline} • Adelaide SA
        </p>
      </td>
    </tr>

    <!-- Decorative Rose Divider Line -->
    <tr>
      <td style="background-color: ${BRAND.colors.rose}; height: 3px; font-size: 0; line-height: 0;">&nbsp;</td>
    </tr>

    <!-- Main Body Container -->
    <tr>
      <td style="padding: 32px; background-color: ${BRAND.colors.cardBg}; border-left: 1px solid ${BRAND.colors.rose}; border-right: 1px solid ${BRAND.colors.rose};" class="fluid-padding">
        
        <!-- Status Banner -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${BRAND.colors.sageLight}; border: 1px solid #c9d8cb; border-radius: 14px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 16px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <span style="display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${BRAND.colors.sage};">
                      Booking Status: Received & Reserved
                    </span>
                    <h2 style="margin: 4px 0 0 0; font-size: 16px; color: ${BRAND.colors.plum}; font-weight: 600;">
                      Session Request Reference: <span style="font-family: monospace; background: #ffffff; padding: 2px 8px; border-radius: 6px; border: 1px solid #c9d8cb; font-size: 15px;">#${referenceNumber}</span>
                    </h2>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Personalized Greeting -->
        <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: ${BRAND.colors.plum};">
          Dear <strong>${clientName}</strong>,
        </p>
        <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 24px; color: ${BRAND.colors.plumLight};">
          Thank you for choosing Falguni's Photography! We have received your booking request through our studio reservation system. Falguni personally reviews every request and will contact you within <strong>24 hours</strong> to finalize your appointment details and discuss creative styling.
        </p>

        <!-- Session Details Box -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${BRAND.colors.cream}; border: 1px solid ${BRAND.colors.rose}; border-radius: 14px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 20px;">
              <h3 style="margin: 0 0 14px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${BRAND.colors.plum}; border-bottom: 1px solid ${BRAND.colors.rose}; padding-bottom: 8px;">
                Your Session Summary
              </h3>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plumLight}; width: 140px; vertical-align: top;">
                    <strong>Service:</strong>
                  </td>
                  <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plum}; font-weight: 600;">
                    ${serviceTitle}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plumLight}; vertical-align: top;">
                    <strong>Requested Date:</strong>
                  </td>
                  <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plum}; font-weight: 600;">
                    ${lead.preferredDate || 'Flexible / To be finalized'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plumLight}; vertical-align: top;">
                    <strong>Client Name:</strong>
                  </td>
                  <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plum};">
                    ${clientName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plumLight}; vertical-align: top;">
                    <strong>Phone:</strong>
                  </td>
                  <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plum};">
                    ${lead.phone || 'Recorded'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plumLight}; vertical-align: top;">
                    <strong>Email:</strong>
                  </td>
                  <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plum};">
                    ${lead.email}
                  </td>
                </tr>
                ${lead.babyDueDateOrBirthDate ? `
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plumLight}; vertical-align: top;">
                    <strong>Baby Due/Birth:</strong>
                  </td>
                  <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plum}; font-weight: 600;">
                    ${lead.babyDueDateOrBirthDate}
                  </td>
                </tr>
                ` : ''}
                ${lead.notes ? `
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plumLight}; vertical-align: top;">
                    <strong>Notes / Requests:</strong>
                  </td>
                  <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plumLight}; font-style: italic;">
                    "${lead.notes}"
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>
        </table>

        <!-- Studio Location & Amenities Card -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${BRAND.colors.roseLight}; border: 1px solid ${BRAND.colors.rose}; border-radius: 14px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 18px 20px;">
              <h4 style="margin: 0 0 6px 0; font-size: 14px; color: ${BRAND.colors.plum}; font-weight: 700;">
                📍 Studio Location & Amenities
              </h4>
              <p style="margin: 0 0 10px 0; font-size: 13px; line-height: 20px; color: ${BRAND.colors.plumLight};">
                <strong>${BRAND.address}</strong><br>
                A peaceful, private studio sanctuary featuring heated 26°C temperature control, dedicated nursing and feeding nooks, and convenient private driveway parking.
              </p>
              <a href="https://maps.google.com/?q=26+South+Pkwy,+Northfield+SA+5085" target="_blank" style="display: inline-block; font-size: 12px; font-weight: 700; color: ${BRAND.colors.sage}; text-decoration: underline;">
                Get Directions on Google Maps &rarr;
              </a>
            </td>
          </tr>
        </table>

        <!-- The Falguni Quality Inclusions -->
        <div style="border-top: 1px solid ${BRAND.colors.rose}; padding-top: 20px; margin-bottom: 24px;">
          <h4 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${BRAND.colors.sage};">
            What's Included in Every Boutique Session
          </h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 22px; color: ${BRAND.colors.plumLight};">
            <li><strong>Certified Infant Handling:</strong> Gentle, baby-led posing honoring natural flexibility and comfort with zero rush.</li>
            <li><strong>Full Studio Wardrobe & Props:</strong> Flowing maternity couture gowns, organic wraps, headbands, and floral eucalyptus wreaths provided free of charge.</li>
            <li><strong>Unhurried Pacing:</strong> Dedicated 2 to 3 hour sessions with unlimited feeding, nursing, and soothing pauses.</li>
            <li><strong>Private Proofing Gallery:</strong> Password-protected digital proofing with museum-grade archival print collections available.</li>
          </ul>
        </div>

        <!-- Next Steps Banner -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border: 1px dashed ${BRAND.colors.sage}; border-radius: 12px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 16px 20px;">
              <h4 style="margin: 0 0 6px 0; font-size: 13px; color: ${BRAND.colors.plum}; font-weight: 700;">
                Next Step: We'll Connect Within 24 Hours
              </h4>
              <p style="margin: 0; font-size: 13px; line-height: 20px; color: ${BRAND.colors.plumLight};">
                Falguni will contact you directly by phone (${lead.phone || 'provided number'}) or email to confirm your exact session time, answer any questions, and share styling tips.
              </p>
            </td>
          </tr>
        </table>

        <!-- Direct Contact Info -->
        <p style="margin: 0 0 4px 0; font-size: 13px; color: ${BRAND.colors.plumLight};">
          Need to make an adjustment or have an urgent question?
        </p>
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: ${BRAND.colors.plum};">
          Call Falguni directly: <a href="tel:${BRAND.phoneRaw}" style="color: ${BRAND.colors.sage}; text-decoration: none;">${BRAND.phone}</a>
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 24px 32px; background-color: ${BRAND.colors.cream}; border: 1px solid ${BRAND.colors.rose}; border-top: none; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; text-align: center;">
        <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: ${BRAND.colors.plum};">
          ${BRAND.name}
        </p>
        <p style="margin: 0 0 10px 0; font-size: 12px; color: ${BRAND.colors.plumLight}; line-height: 18px;">
          26 South Pkwy, Northfield SA 5085 • Adelaide, South Australia<br>
          <a href="${BRAND.website}" style="color: ${BRAND.colors.sage}; text-decoration: none;">falgunisphotography.com.au</a>
        </p>
        <p style="margin: 0; font-size: 11px; color: #9e8e9c;">
          This booking confirmation was automatically dispatched to ${lead.email} on ${timestamp}.<br>
          No SMS or third-party marketing messages will ever be sent to your phone.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `BOOKING CONFIRMATION: FALGUNI'S PHOTOGRAPHY (Ref #${referenceNumber})
============================================================

Dear ${clientName},

Thank you for booking with Falguni's Photography! We have received your session request. Falguni will personally contact you within 24 hours to confirm your appointment details.

SESSION DETAILS:
- Reference Number: #${referenceNumber}
- Service Requested: ${serviceTitle}
- Requested Date: ${lead.preferredDate || 'Flexible / To be finalized'}
- Client Name: ${clientName}
- Phone: ${lead.phone || 'Recorded'}
- Email: ${lead.email}
${lead.babyDueDateOrBirthDate ? `- Baby Due/Birth: ${lead.babyDueDateOrBirthDate}\n` : ''}${lead.notes ? `- Notes: "${lead.notes}"\n` : ''}
STUDIO SANCTUARY:
26 South Pkwy, Northfield SA 5085, Adelaide
Heated 26°C sanctuary, private nursing nooks, free driveway parking.
All wraps, couture maternity gowns, and props are provided free of charge.

Questions? Call Falguni directly at ${BRAND.phone}.
Website: ${BRAND.website}
`;

  return { subject, html, text };
}

/**
 * Generates the responsive HTML email sent to the STUDIO OWNER (cesaresmero2@gmail.com)
 */
export function renderStudioLeadEmail(lead: BookingLead, referenceNumber: string, timestamp: string): { subject: string; html: string; text: string } {
  const serviceTitle = formatServiceTitle(lead.serviceRequested);
  const subject = `✨ New Studio Lead: ${lead.fullName || 'New Client'} (${serviceTitle}) - Ref #${referenceNumber}`;
  const clientName = lead.fullName || "New Client";

  const transcriptRows = lead.transcript && lead.transcript.length > 0
    ? `
      <div style="margin-top: 16px; padding: 14px; background-color: #f7f3ed; border-radius: 10px; border: 1px solid #ebdcd5;">
        <h4 style="margin: 0 0 10px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: ${BRAND.colors.plum};">
          Poppy AI Chat Conversation Transcript:
        </h4>
        ${lead.transcript.map(t => `
          <div style="margin-bottom: 8px; font-size: 13px; line-height: 18px;">
            <strong style="color: ${t.sender === 'user' ? BRAND.colors.plum : BRAND.colors.sage};">${t.sender === 'user' ? clientName : 'Poppy (AI)'} (${t.time}):</strong>
            <span style="color: #423341;">${t.text}</span>
          </div>
        `).join('')}
      </div>
    `
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px 0; background-color: ${BRAND.colors.cream}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 16px; border: 1px solid ${BRAND.colors.rose}; overflow: hidden;">
    <!-- Top Header -->
    <tr>
      <td style="padding: 24px 28px; background-color: ${BRAND.colors.plum}; text-align: center;">
        <span style="display: inline-block; font-size: 11px; font-weight: 700; color: ${BRAND.colors.rose}; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
          Falguni's Photography Admin Dispatch
        </span>
        <h1 style="margin: 0; font-size: 22px; color: #ffffff; font-weight: 500;">
          New Studio Lead Received!
        </h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #d8c7d6;">
          Ref #${referenceNumber} • Logged at ${timestamp}
        </p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 28px;">
        
        <!-- Action Buttons -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
          <tr>
            <td style="padding-right: 8px;" width="50%">
              <a href="tel:${lead.phone}" style="display: block; text-align: center; background-color: ${BRAND.colors.sage}; color: #ffffff; padding: 12px; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none;">
                📞 Call Client Now
              </a>
            </td>
            <td style="padding-left: 8px;" width="50%">
              <a href="mailto:${lead.email}?subject=Your%20Session%20with%20Falguni's%20Photography%20(Ref%20%23${referenceNumber})" style="display: block; text-align: center; background-color: ${BRAND.colors.plum}; color: #ffffff; padding: 12px; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none;">
                ✉️ Reply by Email
              </a>
            </td>
          </tr>
        </table>

        <!-- Client Details Table -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${BRAND.colors.cream}; border: 1px solid ${BRAND.colors.rose}; border-radius: 12px; padding: 16px;">
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #73596e; width: 130px;"><strong>Client Name:</strong></td>
            <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plum}; font-weight: 700;">${clientName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #73596e;"><strong>Phone Number:</strong></td>
            <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plum};"><a href="tel:${lead.phone}" style="color: ${BRAND.colors.sage}; font-weight: 600;">${lead.phone || 'Not provided'}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #73596e;"><strong>Email Address:</strong></td>
            <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plum};"><a href="mailto:${lead.email}" style="color: ${BRAND.colors.sage}; font-weight: 600;">${lead.email || 'Not provided'}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #73596e;"><strong>Service:</strong></td>
            <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plum}; font-weight: 600;">${serviceTitle}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #73596e;"><strong>Requested Date:</strong></td>
            <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plum}; font-weight: 600;">${lead.preferredDate || 'Flexible'}</td>
          </tr>
          ${lead.babyDueDateOrBirthDate ? `
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #73596e;"><strong>Baby Due/Birth:</strong></td>
            <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plum}; font-weight: 600;">${lead.babyDueDateOrBirthDate}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #73596e;"><strong>Source:</strong></td>
            <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plum};">${lead.source || 'Website'}</td>
          </tr>
          ${lead.notes ? `
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #73596e; vertical-align: top;"><strong>Notes:</strong></td>
            <td style="padding: 6px 0; font-size: 14px; color: ${BRAND.colors.plum}; font-style: italic;">"${lead.notes}"</td>
          </tr>
          ` : ''}
        </table>

        ${transcriptRows}

        <p style="margin: 20px 0 0 0; font-size: 12px; color: #888; text-align: center;">
          A styled booking confirmation and session preparation guide has already been dispatched to ${lead.email}.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `NEW STUDIO LEAD RECEIVED (Ref #${referenceNumber})
===================================================
Client: ${clientName}
Phone: ${lead.phone}
Email: ${lead.email}
Service: ${serviceTitle}
Preferred Date: ${lead.preferredDate || 'Flexible'}
${lead.babyDueDateOrBirthDate ? `Baby Due/Birth Date: ${lead.babyDueDateOrBirthDate}\n` : ''}${lead.notes ? `Notes: ${lead.notes}\n` : ''}Source: ${lead.source}
Captured at: ${timestamp}
`;

  return { subject, html, text };
}

/**
 * Generates the responsive HTML email sent to the CLIENT for Contact Form Inquiries
 */
export function renderClientContactEmail(lead: BookingLead, referenceNumber: string, timestamp: string): { subject: string; html: string; text: string } {
  const subject = `✨ We Received Your Message: Falguni's Photography (Ref #${referenceNumber})`;
  const clientName = lead.fullName || "Valued Client";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px 0; background-color: ${BRAND.colors.cream}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 16px; border: 1px solid ${BRAND.colors.rose}; overflow: hidden;">
    <tr>
      <td style="padding: 24px; text-align: center; border-bottom: 2px solid ${BRAND.colors.rose};">
        <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; color: ${BRAND.colors.plum}; font-weight: 400;">
          ${BRAND.name}
        </h1>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: ${BRAND.colors.sage}; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
          Northfield, Adelaide Studio
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px;">
        <h2 style="margin: 0 0 12px 0; font-size: 18px; color: ${BRAND.colors.plum};">
          Dear ${clientName},
        </h2>
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 22px; color: ${BRAND.colors.plumLight};">
          Thank you for reaching out to Falguni's Photography! We have received your inquiry (Ref #${referenceNumber}). Falguni personally answers all messages and will get back to you within 24 hours.
        </p>
        ${lead.notes ? `
        <div style="background-color: ${BRAND.colors.cream}; padding: 16px; border-radius: 10px; border: 1px solid ${BRAND.colors.rose}; margin-bottom: 20px;">
          <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: ${BRAND.colors.sage};">Your Message Copy:</p>
          <p style="margin: 0; font-size: 14px; font-style: italic; color: ${BRAND.colors.plum};">"${lead.notes}"</p>
        </div>
        ` : ''}
        <div style="background-color: ${BRAND.colors.roseLight}; padding: 16px; border-radius: 10px; font-size: 13px; line-height: 19px; color: ${BRAND.colors.plum};">
          <strong>Need immediate assistance?</strong><br>
          Call Falguni directly at <a href="tel:${BRAND.phoneRaw}" style="color: ${BRAND.colors.sage}; font-weight: 700;">${BRAND.phone}</a> or visit us at 26 South Pkwy, Northfield SA 5085.
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 28px; background-color: ${BRAND.colors.cream}; text-align: center; border-top: 1px solid ${BRAND.colors.rose}; font-size: 11px; color: #888;">
        Dispatched to ${lead.email} at ${timestamp}. Email notifications only.
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `THANK YOU FOR REACHING OUT (Ref #${referenceNumber})
==================================================
Dear ${clientName},

Thank you for reaching out to Falguni's Photography. We have received your message and Falguni will respond within 24 hours.

Your Message: "${lead.notes || 'Inquiry received'}"

Phone: ${BRAND.phone}
Studio: ${BRAND.address}
Website: ${BRAND.website}
`;

  return { subject, html, text };
}

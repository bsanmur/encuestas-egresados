import { prisma } from "../lib/prisma.js";
import { transporter } from "../lib/mailer.js";

// GET /api/mailing/subscribers (Admin Protected)
export async function getSubscribers(req, res) {
  // Query parameters for segmentation: ?program=Informatica&year=2010
  const { program, year } = req.query;
  const where = { isApproved: true, isSubscribed: true };

  if (program) where.program = program;
  if (year) {
    const parsed = parseInt(year, 10);
    if (!Number.isNaN(parsed)) where.graduationYear = parsed;
  }

  try {
    const subscribers = await prisma.alumniProfile.findMany({
      where,
      select: {
        fullName: true,
        program: true,
        graduationYear: true,
        user: {
          select: {
            email: true
          }
        }
      },
    });

    res.json({
      count: subscribers.length,
      subscribers,
      filter: { program, year },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch subscribers list." });
  }
}

// POST /api/mailing/send (Admin Protected)
export async function sendNewsletter(req, res) {
  const { program, year } = req.body;

  const surveyLink = "http://localhost:5173/alumni";
  const subject = "[UdeC] Survey for graduates";
  const content = `
    <p>Dear Alumni,</p>
    <p>We invite you to participate in our graduate survey to help us improve our programs and services.</p>
    <p>Please click the following link to access the survey: <a href="${surveyLink}">${surveyLink}</a></p>
  `;

  const where = { isApproved: true, isSubscribed: true };
  
  if (program) where.program = program;
  
  if (year) {
    const parsed = parseInt(year, 10);
    if (!Number.isNaN(parsed)) where.graduationYear = parsed;
  }

  console.log("Preparing to send newsletter with filter:", where);

  try {
    const subscribers = await prisma.alumniProfile.findMany({
      where,
      select: {
        fullName: true,
        user: {
          select: {
            email: true
          }
        }
      }
    });

    console.log(`Found ${subscribers.length} subscribers matching criteria.`);

    if (!subscribers || subscribers.length === 0) {
      return res.status(200).json({ 
        message: "No subscribed alumni found matching the criteria." 
      });
    }

    console.log("Preparing to send emails...");

    const subscriberEmails = subscribers
      .map((s) => s.user.email)
      .filter(Boolean)
      .join(",");

    if (!subscriberEmails) {
      return res.status(400).json({
        message: "No valid email addresses found for the selected alumni."
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"UdeC Alumni" <alumni@udec.cl>',
      bcc: subscriberEmails,
      subject,
      html: content,
    };

    await transporter.sendMail(mailOptions);

    console.log("--- NEWSLETTER SENT ---");
    console.log(`Filter: Program=${program || "ALL"}, Year=${year || "ALL"}`);
    console.log(`Subject: ${subject}`);
    console.log(`Sent to ${subscribers.length} alumni.`);

    res.json({
      message: "Newsletter successfully sent via Nodemailer/ESP.",
      recipients: subscribers.length,
      subject,
      filter: { program, year },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      message: "Error sending newsletter. Check server logs and ESP configuration.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

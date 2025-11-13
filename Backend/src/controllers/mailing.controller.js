import prisma from "../lib/prisma.js";
import transporter from "../lib/mailer.js";

export async function getSubscribers(req, res) {
  // Query parameters for segmentation: ?program=Informatica&year=2010
  const { program, year } = req.query;
  const where = { isSubscribed: true };

  if (program) where.program = program;
  if (year) {
    const parsed = parseInt(year, 10);
    if (!Number.isNaN(parsed)) where.graduationYear = parsed;
  }

  try {
    const subscribers = await prisma.alumnus.findMany({
      where,
      select: {
        firstName: true,
        lastName: true,
        email: true,
        matricula: true,
        program: true,
        graduationYear: true,
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
  const { subject, content, program, year } = req.body;
  if (!subject || !content) {
    return res
      .status(400)
      .json({
        message: "Subject and content are required for the newsletter.",
      });
  }

  const where = { isSubscribed: true };
  if (program) where.program = program;
  if (year) {
    const parsed = parseInt(year, 10);
    if (!Number.isNaN(parsed)) where.graduationYear = parsed;
  }

  try {
    const subscribers = await prisma.alumnus.findMany({
      where,
      select: { email: true, firstName: true },
    });

    if (!subscribers || subscribers.length === 0) {
      return res
        .status(200)
        .json({ message: "No subscribed alumni found matching the criteria." });
    }

    const subscriberEmails = subscribers.map((s) => s.email).join(",");

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
      message:
        "Error sending newsletter. Check server logs and ESP configuration.",
    });
  }
}

// PUT /api/alumni/subscribe (Protected)
export async function updateSubscription(req, res) {
  const { isSubscribed } = req.body;
  if (typeof isSubscribed !== "boolean") {
    return res
      .status(400)
      .json({ message: "isSubscribed must be a boolean value." });
  }

  try {
    // Attempt update by id; adjust parsing if your Prisma model uses Int ids
    const id = req.userId;
    const where = { id };

    const alumnus = await prisma.alumnus.update({
      where,
      data: { isSubscribed },
      select: { isSubscribed: true },
    });

    res.json({
      message: `Subscription status updated to: ${
        isSubscribed ? "Subscribed" : "Unsubscribed"
      }`,
      isSubscribed: alumnus.isSubscribed,
    });
  } catch (error) {
    console.error(error);
    // If update fails due to id type mismatch, log and return 404 for now
    res.status(500).json({ message: "Error updating subscription status." });
  }
}

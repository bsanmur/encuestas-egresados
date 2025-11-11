// --- Dependencies ---
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); 

// --- Configuration ---
const app = express();
const PORT = process.env.PORT || 3000;

// UPDATE: Load configurations from Environment Variables
const SECRET_KEY = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

if (!SECRET_KEY || !MONGODB_URI) {
    console.error("CRITICAL ERROR: JWT_SECRET and MONGODB_URI environment variables must be set.");
    process.exit(1);
}

// --- Nodemailer Configuration (Ready for SendGrid/Mailgun SMTP) ---
// This transporter is configured to pull credentials from environment variables.
// Use process.env.EMAIL_HOST, process.env.EMAIL_USER, process.env.EMAIL_PASS
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.example.com', // e.g., smtp.sendgrid.net or smtp.mailgun.org
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_PORT == 465, // Use true if port is 465, false for 587 or 2525
    auth: {
        user: process.env.EMAIL_USER, // e.g., your_sendgrid_username (often 'apikey')
        pass: process.env.EMAIL_PASS, // e.g., your_sendgrid_password (often the actual API key)
    },
});

// Optional: Verify transporter connection (run once on startup)
transporter.verify(function (error, success) {
    if (error) {
        console.warn("Nodemailer transporter connection failed. Check EMAIL_HOST/PORT/AUTH variables.");
        // console.error(error); // Uncomment for detailed debug
    } else {
        console.log("Nodemailer transporter ready to send emails.");
    }
});


// Used to parse incoming request bodies into JSON format
app.use(express.json());

// --- Database Connection ---
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connection successful.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Schema & Model ---
const AlumnusSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    matricula: { type: String, required: true, unique: true }, // UdeC Alumni ID/Registration Number
    program: { type: String, required: true }, // NEW: e.g., 'Informatica', 'Derecho'
    graduationYear: { type: Number, required: true }, // NEW: e.g., 2010, 2023
    isSubscribed: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false } // For access to mailing and admin routes
});

// Middleware to hash password before saving
AlumnusSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const Alumnus = mongoose.model('Alumnus', AlumnusSchema);

// --- Authentication Middleware ---
// Protects routes, ensuring a valid JWT is present
const verifyToken = (req, res, next) => {
    // Get the token from the Authorization header (Bearer TOKEN)
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Access denied. Token format incorrect.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.id;
        req.userIsAdmin = decoded.isAdmin;
        next(); // Proceed to the protected route handler
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

// Middleware to check for Admin role
const verifyAdmin = (req, res, next) => {
    if (!req.userIsAdmin) {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
};

// --- Controllers (API Logic) ---

// 1. Authentication Controller
const authController = {
    // POST /api/auth/register
    register: async (req, res) => {
        const { firstName, lastName, email, password, matricula, program, graduationYear } = req.body;
        if (!firstName || !lastName || !email || !password || !matricula || !program || !graduationYear) {
            return res.status(400).json({ message: 'All fields (including program and graduation year) are required.' });
        }

        try {
            // Password hashing is handled by the Mongoose 'pre' save hook
            const newAlumnus = new Alumnus({ firstName, lastName, email, password, matricula, program, graduationYear });
            await newAlumnus.save();
            res.status(201).json({ message: 'Registration successful. Please log in.' });
        } catch (error) {
            console.error(error);
            if (error.code === 11000) {
                return res.status(409).json({ message: 'Email or Matricula already registered.' });
            }
            res.status(500).json({ message: 'Server error during registration.' });
        }
    },

    // POST /api/auth/login
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const alumnus = await Alumnus.findOne({ email });
            if (!alumnus) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            const isMatch = await bcrypt.compare(password, alumnus.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            // Generate JWT payload
            const token = jwt.sign(
                { id: alumnus._id, isAdmin: alumnus.isAdmin },
                SECRET_KEY,
                { expiresIn: '1h' } // Token expires in 1 hour
            );

            res.json({ token, isAdmin: alumnus.isAdmin, message: 'Login successful' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error during login.' });
        }
    },

    // GET /api/alumni/profile (Protected)
    getProfile: async (req, res) => {
        try {
            const alumnus = await Alumnus.findById(req.userId).select('-password'); // Exclude password
            if (!alumnus) {
                return res.status(404).json({ message: 'Alumnus not found.' });
            }
            res.json(alumnus);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error.' });
        }
    }
};

// 2. Mailing and Admin Controller
const mailingController = {
    // GET /api/mailing/subscribers (Admin Protected)
    getSubscribers: async (req, res) => {
        // Query parameters for segmentation: ?program=Informatica&year=2010
        const { program, year } = req.query;
        let query = { isSubscribed: true };

        if (program) {
            query.program = program;
        }
        if (year) {
            query.graduationYear = year;
        }

        try {
            const subscribers = await Alumnus.find(query).select('firstName lastName email matricula program graduationYear');
            res.json({ count: subscribers.length, subscribers, filter: { program, year } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Could not fetch subscribers list.' });
        }
    },

    // POST /api/mailing/send (Admin Protected)
    sendNewsletter: async (req, res) => {
        const { subject, content, program, year } = req.body;
        if (!subject || !content) {
            return res.status(400).json({ message: 'Subject and content are required for the newsletter.' });
        }

        let query = { isSubscribed: true };
        if (program) {
            query.program = program;
        }
        if (year) {
            query.graduationYear = year;
        }

        try {
            const subscribers = await Alumnus.find(query).select('email firstName');

            if (subscribers.length === 0) {
                return res.status(200).json({ message: 'No subscribed alumni found matching the criteria.' });
            }

            // --- ACTUAL EMAIL SENDING LOGIC USING NODEMAILER ---
            const subscriberEmails = subscribers.map(s => s.email).join(',');

            const mailOptions = {
                from: '"UdeC Alumni" <alumni@udec.cl>', // Must be a verified sender in your ESP
                bcc: subscriberEmails, // Use BCC for mass mailing to protect user privacy
                subject: subject,
                html: content 
            };
            
            await transporter.sendMail(mailOptions);
            // -----------------------------------------------------

            console.log(`--- NEWSLETTER SENT ---`);
            console.log(`Filter: Program=${program || 'ALL'}, Year=${year || 'ALL'}`);
            console.log(`Subject: ${subject}`);
            console.log(`Sent to ${subscribers.length} alumni.`);
            
            res.json({
                message: 'Newsletter successfully sent via Nodemailer/ESP.',
                recipients: subscribers.length,
                subject,
                filter: { program, year }
            });

        } catch (error) {
            console.error('Error sending email:', error);
            // Log the error but send a standard server error response
            res.status(500).json({ message: 'Error sending newsletter. Check server logs and ESP configuration.' });
        }
    },

    // PUT /api/alumni/subscribe (Protected)
    updateSubscription: async (req, res) => {
        const { isSubscribed } = req.body;
        if (typeof isSubscribed !== 'boolean') {
             return res.status(400).json({ message: 'isSubscribed must be a boolean value.' });
        }
        try {
            const alumnus = await Alumnus.findByIdAndUpdate(
                req.userId,
                { isSubscribed },
                { new: true, select: '-password' }
            );

            if (!alumnus) {
                 return res.status(404).json({ message: 'Alumnus not found.' });
            }

            res.json({
                message: `Subscription status updated to: ${isSubscribed ? 'Subscribed' : 'Unsubscribed'}`,
                isSubscribed: alumnus.isSubscribed
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating subscription status.' });
        }
    }
};

// ------------------------------------------------------------------
// --- Routes (The REST API Interface) ---
const apiRouter = express.Router();

// Public Authentication Routes
apiRouter.post('/auth/register', authController.register);
apiRouter.post('/auth/login', authController.login);

// Protected Alumni/User Routes
apiRouter.get('/alumni/profile', verifyToken, authController.getProfile);
apiRouter.put('/alumni/subscribe', verifyToken, mailingController.updateSubscription);

// Protected Mailing/Admin Routes
apiRouter.get('/mailing/subscribers', verifyToken, verifyAdmin, mailingController.getSubscribers);
apiRouter.post('/mailing/send', verifyToken, verifyAdmin, mailingController.sendNewsletter);

// Apply the API router
app.use('/api', apiRouter);

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`UdeC Alumni Mailing Service REST API running on http://localhost:${PORT}`);
    console.log(`Available endpoints: /api/auth/register, /api/auth/login, /api/alumni/profile, etc.`);
});
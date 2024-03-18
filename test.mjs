import express from 'express';
import { body, validationResult } from 'express-validator';
import { Database } from './Database.mjs'; // Import the Database class
import { ContactService } from './ContactService.mjs'; // Import the ContactService class

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new Database();
await db.connect();
const contactService = new ContactService(db);

// Validation rules
const contactValidationRules = () => {
    return [
        // Validate and sanitize the first_name field
        body('first_name').trim().escape().notEmpty().withMessage('First name is required'),
        
        // Validate and sanitize the last_name field
        body('last_name').trim().escape().notEmpty().withMessage('Last name is required'),
        
        // Validate and sanitize the email field
        body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
        
        // Validate and sanitize the phone field
        body('phone').trim().escape().isMobilePhone('any').withMessage('Invalid phone number')
    ];
};

// Validation function
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Routes
app.post('/address-book', contactValidationRules(), validate, async (req, res) => {
    // Use contactService to handle the request
    const { first_name, last_name, phone, email } = req.body;
    const result = await contactService.createContact(first_name, last_name, phone, email);
    res.json(result);
});

// More routes here...

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

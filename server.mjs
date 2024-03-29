import express from 'express';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import { Database } from './Database.mjs'; // Import the Database class
import { ContactService } from './ContactService.mjs'; // Import the ContactService class

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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

//log all the requests
app.use((req, res, next) => {
    //log the time in iso format
    console.log(new Date().toISOString()+": "+req.method+" request at " + req.url);
    next();
});

app.get('/', (req, res) => {
    res.send('OK');
}
);

// Create a new address book entry
app.post('/add', contactValidationRules(), validate, async (req, res) => {
    const { first_name, last_name, phone, email } = req.body;
    try {
        const result = await contactService.createContact(first_name, last_name, phone, email);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single address book entry
app.get('/address-book/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await contactService.getContactById(id);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
);

// Update an address book entry
app.put('/update/:id', contactValidationRules(), validate, async (req, res) => {
    const id = req.params.id;
    const { first_name, last_name, phone, email } = req.body;
    try {
        const result = await contactService.updateContact(id, first_name, last_name, phone, email);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an address book entry
app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await contactService.deleteContact(id);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all contacts
app.get('/search/', async (req, res) => {
    try {
        const result = await contactService.getAllContacts();
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Search in name and email
app.get('/search/:search', async (req, res) => {
    const search = decodeURIComponent(req.params.search);
    
    try {
        const result = await contactService.searchContact(search);
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}
);


// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
});

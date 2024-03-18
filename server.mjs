import express from 'express';
import pkg from 'mysql2/promise';
import { body, validationResult } from 'express-validator';


// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

const port = 3000;

// Create MySQL connection
const connection = await pkg.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'maazdubai',
    database: 'address_book_db'
});

// Connect to MySQL server
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL server: ', err);
        return;
    }
    console.log('Connected to MySQL server');
});
//log all the requests
app.use((req, res, next) => {
    //log the time in iso format
    console.log(new Date().toISOString()+": "+req.method+" request at " + req.url);
    next();
});

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
  
  const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
  
// Create a new address book entry
app.post('/address-book', contactValidationRules(), validate, async (req, res) => {
    const { first_name, last_name, phone, email } = req.body;

    try {
        // Check for existing contact with the same email or phone number
        const existingContact = await connection.query(
            'SELECT * FROM address_book WHERE email = ? OR phone = ?',
            [email, phone]
        );

        if (existingContact.length > 0) {
            // Conflict: Contact with this email or phone already exists
            return res.status(409).send('A contact with the same email or phone number already exists.');
        }

        // Insert new contact into the database
        const query = 'INSERT INTO address_book (first_name, last_name, phone, email) VALUES (?, ?, ?, ?)';
        await connection.query(query, [first_name, last_name, phone, email]);

        res.status(201).send('Address book entry created successfully');
    } catch (err) {
        console.error('Error creating address book entry: ', err);
        res.status(500).send('Error creating address book entry');
    }
});

app.get('/' , (req, res) => {
    res.send('Hello World');
}
);
// Get all address book entries
app.get('/address-book', (req, res) => {
    const query = 'SELECT * FROM address_book';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving address book entries: ', err);
            res.status(500).send('Error retrieving address book entries');
            return;
        }
        res.status(200).json(results);
    });
});
// Get a single address book entry
app.get('/address-book/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM address_book WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error retrieving address book entry: ', err);
            res.status(500).send('Error retrieving address book entry');
            return;
        }
        res.status(200).json(results);
    });
}
);

// Update an address book entry
app.put('/address-book/:id', (req, res) => {
    const id = req.params.id;
    const { first_name, last_name, phone, email } = req.body;

    const query = 'UPDATE address_book SET first_name = ?, last_name = ?, phone = ?, email = ? WHERE id = ?';
    connection.query(query, [first_name, last_name, phone, email, id], (err, result) => {
        if (err) {
            console.error('Error updating address book entry: ', err);
            res.status(500).send('Error updating address book entry');
            return;
        }
        res.status(200).send('Address book entry updated successfully');
    });
});
// Delete an address book entry
app.delete('/address-book/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM address_book WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting address book entry: ', err);
            res.status(500).send('Error deleting address book entry');
            return;
        }
        res.status(200).send('Address book entry deleted successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
});
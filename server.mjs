
import express from 'express';
import mysql from 'mysql';

const app = express();
const port = 3000;

/*
    localhost
    port: 3306
    user: root
    password: maazdubai
*/
// Create MySQL connection
const connection = mysql.createConnection({
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

// Create a new address book entry
app.post('/address-book', (req, res) => {
    const { first_name, last_name, phone, email } = req.body;

    const query = 'INSERT INTO address_book (first_name, last_name, phone, email) VALUES (?, ?, ?, ?)';
    connection.query(query, [first_name, last_name, phone, email], (err, result) => {
        if (err) {
            console.error('Error creating address book entry: ', err);
            res.status(500).send('Error creating address book entry');
            return;
        }
        res.status(201).send('Address book entry created successfully');
    });
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
});
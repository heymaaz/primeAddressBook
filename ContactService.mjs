export class ContactService {
    constructor(database) {
        this.db = database;
    }

    async findContactByEmail(email) {
        const [rows] = await this.db.query('SELECT * FROM address_book WHERE email = ?', [email]);
        return rows;
    }

    async createContact(first_name, last_name, phone, email) {
        const existingContact = await this.findContactByEmail(email);
        if (existingContact.length > 0) {
            return 'A contact with the same email already exists.';
        }
        const query = 'INSERT INTO address_book (first_name, last_name, phone, email) VALUES (?, ?, ?, ?)';
        await this.db.query(query, [first_name, last_name, phone, email]);
        return 'Address book entry created successfully';
    }

}

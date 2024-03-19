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
            throw new Error('A contact with the same email already exists.');
        }
        const query = 'INSERT INTO address_book (first_name, last_name, phone, email) VALUES (?, ?, ?, ?)';
        await this.db.query(query, [first_name, last_name, phone, email]);
        return 'Address book entry created successfully';
    }

    async getAllContacts() {
        const [results] = await this.db.query('SELECT * FROM address_book');
        return results;
    }

    async getContactById(id) {
        //sanitize the input
        if (isNaN(id)) {
            throw new Error('Invalid input for id. Please provide a number.');
        }
        const [results] = await this.db.query('SELECT * FROM address_book WHERE id = ?', [id]);
        if (results.length > 0) {
            return results[0];
        }
        throw new Error('Address book entry not found');
    }

    async updateContact(id, first_name, last_name, phone, email) {
        //sanitize the input
        if (isNaN(id)) {
            throw new Error('Invalid input for id. Please provide a number.');
        }
        //check if previous email is the same as the new email
        const contact = await this.getContactById(id);
        if (contact.email !== email) {
            const existingContact = await this.findContactByEmail(email);
            if (existingContact.length > 0) {
                throw new Error('A contact with the same email already exists.');
            }
        }
        const query = 'UPDATE address_book SET first_name = ?, last_name = ?, phone = ?, email = ? WHERE id = ?';
        const [result] = await this.db.query(query, [first_name, last_name, phone, email, id]);
        if (result.affectedRows > 0) {
            return 'Address book entry updated successfully';
        }
        throw new Error('Address book entry not found');
    }

    async deleteContact(id) {
        //sanitize the input
        if (isNaN(id)) {
            throw new Error('Invalid input for id. Please provide a number.');
        }
        const query = 'DELETE FROM address_book WHERE id = ?';
        const [result] = await this.db.query(query, [id]);
        if (result.affectedRows > 0) {
            return 'Address book entry deleted successfully';
        }
        throw new Error('Address book entry not found');
    }
    
    async searchContact(searchTerm) {
        //sanitize the input
        searchTerm = searchTerm.replace(/[^a-zA-Z0-9 ]/g, '');
        if (!searchTerm) {
            throw new Error('Search term is required');
        }
        const query = 'SELECT * FROM address_book WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?';
        const [rows] = await this.db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]);
        return rows;
    }
}

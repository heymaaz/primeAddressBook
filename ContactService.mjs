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
        const [results] = await this.db.query('SELECT * FROM address_book WHERE id = ?', [id]);
        if (results.length > 0) {
            return results[0];
        }
        throw new Error('Address book entry not found');
    }

    async updateContact(id, first_name, last_name, phone, email) {
        const query = 'UPDATE address_book SET first_name = ?, last_name = ?, phone = ?, email = ? WHERE id = ?';
        const [result] = await this.db.query(query, [first_name, last_name, phone, email, id]);
        if (result.affectedRows > 0) {
            return 'Address book entry updated successfully';
        }
        throw new Error('Address book entry not found');
    }

    async deleteContact(id) {
        const query = 'DELETE FROM address_book WHERE id = ?';
        const [result] = await this.db.query(query, [id]);
        if (result.affectedRows > 0) {
            return 'Address book entry deleted successfully';
        }
        throw new Error('Address book entry not found');
    }

    async searchContact(searchTerm) {
        if (!searchTerm) {
            throw new Error('Search term is required');
        }
        const query = 'SELECT * FROM address_book WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?';
        const [rows] = await this.db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]);
        return rows;
    }
}

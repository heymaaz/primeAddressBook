import pkg from 'mysql2/promise';

export class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        this.connection = await pkg.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'maazdubai',
            database: 'address_book_db'
        });
    }

    async query(sql, params) {
        return await this.connection.execute(sql, params);
    }

    async close() {
        await this.connection.end();
    }
}

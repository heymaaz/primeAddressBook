import { expect } from 'chai';
import sinon from 'sinon';
import { ContactService } from '../ContactService.mjs'; // Adjust path as necessary
import { Database } from '../Database.mjs'; // Adjust path as necessary

describe('ContactService', () => {
    let mockDB;
    before(() => {
        // Initalize the mock database
        mockDB = new Database();
        
        
    });
    it('should create a new contact', async () => {
        
        // Stub the query method to return a promise that resolves to an empty array
        sinon.stub(mockDB, 'query').returns(Promise.resolve([[], []]));
        
        // Inject the mocked Database into ContactService
        const service = new ContactService(mockDB);
        
        // create a new contact
        const result = await service.createContact('John', 'Doe', '1234567890', 'johndoe@gmail.com');
        
        // Assert the expected outcome
        expect(result).to.equal('Address book entry created successfully');
        
        
    });
    it('should find a contact by email', async () => {
        
        // Stub the query method to return a promise that resolves to an array of contacts
        sinon.stub(mockDB, 'query').returns(Promise.resolve([[{ id: 1, email: 'test@example.com' }], []]));
        // Inject the mocked Database into ContactService
        const service = new ContactService(mockDB);
        
        // search for a contact by email
        const contact = await service.findContactByEmail('test@example.com');
        
        // Assert the expected outcome
        expect(contact).to.have.lengthOf(1);
        expect(contact[0].id).to.equal(1);
        expect(contact[0].email).to.equal('test@example.com');
        
    });
    it('should get all contacts', async () => {
        // Stub the query method to return a promise that resolves to an array of contacts
        sinon.stub(mockDB, 'query').returns(Promise.resolve([[
            { id: 1, email: 'test@example.com' },
            { id: 2, email: 'test2@example.com' },
            { id: 3, email: 'test3@example.com' },
            { id: 4, email: 'test4@example.com' }
        ], []]));
        
        // Inject the mocked Database into ContactService
        const service = new ContactService(mockDB);
        
        // get all contacts
        const contacts = await service.getAllContacts();
        
        // Assert the expected outcome
        expect(contacts).to.have.lengthOf(4);
        expect(contacts[0].id).to.equal(1);
        expect(contacts[0].email).to.equal('test@example.com');
        expect(contacts[1].id).to.equal(2);
        expect(contacts[1].email).to.equal('test2@example.com');
        expect(contacts[2].id).to.equal(3);
        expect(contacts[2].email).to.equal('test3@example.com');
        expect(contacts[3].id).to.equal(4);
        expect(contacts[3].email).to.equal('test4@example.com');
        
    });
    it('should get a contact by id', async () => {
        // Stub the query method to return a promise that resolves to an array of contacts
        sinon.stub(mockDB, 'query').returns(Promise.resolve([[
            { id: 1, email: 'test@example.com', first_name: 'test', last_name: 'test'},
            { id: 2, email: 'test2@example.com', first_name: 'test', last_name: 'test'},
            { id: 3, email: 'test3@example.com' , first_name: 'test', last_name: 'test'},
            { id: 4, email: 'test4@example.com', first_name: 'test', last_name: 'test'}
        ], []]));
        
        // Inject the mocked Database into ContactService
        const service = new ContactService(mockDB);
        
        // get a contact by id
        const contact = await service.getContactById(1);
        
        // Assert the expected outcome
        expect(contact.id).to.equal(1);
        expect(contact.email).to.equal('test@example.com');
        
    });
    it('should delete a contact', async () => {
        // Stub the query method to return a promise that resolves to an object indicating a successful deletion
        sinon.stub(mockDB, 'query').returns(Promise.resolve([{ affectedRows: 1 }, []]));
        
        // Inject the mocked Database into ContactService
        const service = new ContactService(mockDB);
        
        // delete a contact
        const result = await service.deleteContact(1);
        
        // Assert the expected outcome
        expect(result).to.equal('Address book entry deleted successfully');
    });
    
    afterEach(() => {
        // Restore the original functionality for future tests
        sinon.restore();
    });
});
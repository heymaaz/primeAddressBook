import { expect } from 'chai';
import sinon from 'sinon';
import { ContactService } from '../ContactService.mjs'; // Adjust path as necessary
import { Database } from '../Database.mjs'; // Adjust path as necessary

describe('ContactService', () => {
    it('should find a contact by email', async () => {
        // Create a mock for the Database class
        const mockDB = new Database();
        sinon.stub(mockDB, 'query').returns(Promise.resolve([[{ id: 1, email: 'test@example.com' }], []]));

        // Inject the mocked Database into ContactService
        const service = new ContactService(mockDB);

        // search for a contact by email
        const contact = await service.findContactByEmail('test@example.com');

        // Assert the expected outcome
        expect(contact).to.have.lengthOf(1);
        expect(contact[0].id).to.equal(1);
        expect(contact[0].email).to.equal('test@example.com');

        // Restore the original functionality for future tests
        mockDB.query.restore();
    });
});

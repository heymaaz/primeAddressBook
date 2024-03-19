# Prime Address Book

### Task summary
We would like you to build an address book application for a single user, with all data stored in a MySQL database. As part of the application, you should implement the following:

### Object-orientated code
All code should be fully object-orientated and properly namespaced. Bonus marks for demonstration of dependency injection and unit tests.

### Programming Language
We don’t prescribe which language you should use; we want you to use what your most familiar with so you can show off your skills.

### Build brief
You should build the app in three stages, using Git for source control. Commit regularly so we can see how the system progressed:

- Step 1 – Setup database
Create a MySQL database with tables to store a list of contacts with attributes as listed in the example data.

- Step 2 – Build API
Add API endpoints to your application for the following common functions. These should accept and return JSON: List contacts, search contacts by name/email, retrieve single contact, create contact, edit contact, delete contact.

- Step 3 – Build frontend
Add a basic UI to interact with your API and allow the user to list, search, view, add, edit, and delete contacts.

### Example data
``` sh
[	
    { 
        "first_name": "David", 
        "last_name": "Platt",		
        "phone": "01913478234",		
        "email": "david.platt@corrie.co.uk" 
    }, 
    { 
        "first_name": "Jason",		
        "last_name": "Grimshaw",		
        "phone": "01913478123",		
        "email": "jason.grimshaw@corrie.co.uk" 
    }, 
    { 
        "first_name": "Ken",		
        "last_name": "Barlow",		
        "phone": "019134784929",		
        "email": "ken.barlow@corrie.co.uk" 
    }, 
    { 
        "first_name": "Rita",		
        "last_name": "Sullivan",		
        "phone": "01913478555",		
        "email": "rita.sullivan@corrie.co.uk" 
    }, 
    { 
        "first_name": "Steve",		
        "last_name": "McDonald",		
        "phone": "01913478555",		
        "email": "steve.mcdonald@corrie.co.uk" 
    } 
]
```

## Implementation
- Clone the MySQL database using the database dump: [sqlDump](dump/PrimeAddressBook.sql)
- get node modules
``` sh
    npm install
```
- Start the server
``` sh
    npm start
```
- open the frontend deployed on [https://heymaaz.github.io/primeAddressBook](https://heymaaz.github.io/primeAddressBook)

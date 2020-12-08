import { expect } from 'chai';
import Application from '../model/Application';
import Code from '../model/Code';
import SelectedFiles from '../model/SelectedFiles';
import User from '../model/User';

describe('Application Tests', () => {

    describe('singleton constructor', () => {
        Application.reset();
        let app = Application.instance();  

        it('Calling the application instance returns the same type', () => {
            expect(typeof Application.instance()).to.equal(typeof app);
        });
        
        it('Users are an empty map', () => {
            expect(app.getUsers()).to.deep.equal(new Map<string, User>());
        });

        it('Number of users is 0', () => {
            expect(app.getUsers().size).to.equal(0);
        });

        it('Current user is null', () => {
            expect(app.getCurrentUser()).to.be.null;
        });
    });

    describe('getUsers() with no users', () => {
        Application.reset();
        let app = Application.instance();

        it('Users are an empty map', () => {
            expect(app.getUsers()).to.deep.equal(new Map<string, User>());
        });

        it('Number of users is 0', () => {
            expect(app.getUsers().size).to.equal(0);
        });
    });

    describe('getUsers() with one user', () => {
        Application.reset();
        let app = Application.instance();

        let user1 = new User("username", "password");
        app.register(user1);

        it('Number of users is 1', () => {
            expect(app.getUsers().size).to.equal(1);
        });

        it('The user is equal to the one that logged in', () => {
            expect(app.getUsers().get("username")).to.deep.equal(user1);
        });
    });

    describe('getUsers() with two users', () => {
        Application.reset();
        let app = Application.instance();

        let user1 = new User("username", "password");
        let user2 = new User("admin", "password");
        app.register(user1);
        app.register(user2);

        it('Number of users is 2', () => {
            expect(app.getUsers().size).to.equal(2);
        });

        it('The first user is equal to the one that logged in first', () => {
            expect(app.getUsers().get("username")).to.deep.equal(user1);
        });

        it('The second user is equal to the one that logged in second', () => {
            expect(app.getUsers().get("admin")).to.deep.equal(user2);
        });
    });

    describe('getCurrentUser() for 0 users', () => {
        Application.reset();
        let app = Application.instance();  

        it('Current user is set to null', () => {
            expect(app.getCurrentUser()).to.be.null;
        });
    });

    describe('getCurrentUser() for 1 user', () => {
        Application.reset();
        let app = Application.instance();  

        let user1 = new User("username", "password");
        app.register(user1);

        it('Current user is set to the most recent one', () => {
            expect(app.getCurrentUser()).to.deep.equal(user1);
        });
    });

    describe('getCurrentUser() for 2 users', () => {
        Application.reset();
        let app = Application.instance();  

        let user1 = new User("username", "password");  
        let user2 = new User("admin", "password");
        app.register(user1);      
        app.register(user2);

        it('Current user is set to the most recent one', () => {
            expect(app.getCurrentUser()).to.deep.equal(user2);
        });
    });

    describe('setCurrentUser() does not change user', () => {
        Application.reset();
        let app = Application.instance();  

        let user1 = new User("username", "password");  
        let user2 = new User("admin", "password");
        app.register(user1);      
        app.register(user2);

        app.setCurrentUser(user2);

        it('Current user is the one just set', () => {
            expect(app.getCurrentUser()).to.deep.equal(user2);
        });

        it('Setting user that does not exist throws an error', () => {
            expect(app.setCurrentUser.bind(app, new User("nonexisting", "password"))).to.throw();
        });
    });
    
    describe('setCurrentUser() changes user', () => {
        Application.reset();
        let app = Application.instance();  

        let user1 = new User("username", "password");  
        let user2 = new User("admin", "password");
        app.register(user1);      
        app.register(user2);

        app.setCurrentUser(user1);

        it('Current user is the one just set', () => {
            expect(app.getCurrentUser()).to.deep.equal(user1);
        });
    });
    
    describe('register()', () => {
        Application.reset();
        let app = Application.instance();  
        
        let user1 = new User("username", "password");
        let user2 = new User("admin", "password");
        app.register(user1);
        app.register(user2);

        it('Current user is set to the most recent one', () => {
            expect(app.getCurrentUser()).to.deep.equal(user2);
        });

        it('Number of users is 2', () => {
            expect(app.getUsers().size).to.equal(2);
        });

        it('Registering another user with the same name throws an error', () => {
            expect(app.register.bind(app, new User("username", "password"))).to.throw();
        });
    });
    
    describe('login()', () => {
        Application.reset();
        let app = Application.instance();  

        let user1 = new User("username", "password");
        let user2 = new User("admin", "password");
        app.register(user1);
        app.register(user2);

        app.login(user1)

        it('Current user is the one that just logged in', () => {
            expect(app.getCurrentUser()).to.deep.equal(user1);
        });

        it('Logging in user that does not exist throws an error', () => {      
            expect(app.login.bind(app, new User("nonexisting", "password"))).to.throw();
        });
    });
    
    describe('upload() without being logged in', () => {
        Application.reset();
        let app = Application.instance();  
        let user1 = new User("username", "password");
        app.register(user1);
        app.logout();

        it('Uploading file without logging in throws an error', () => {      
            expect(app.upload.bind(app, new Code("file.py", "print(\"hello world\")"))).to.throw();
        });
    });

    describe('upload() zero files', () => {
        Application.reset();
        let app = Application.instance();  
        let user1 = new User("username", "password");
        app.register(user1);

        it('Number of files should equal 0', () => {      
            expect(app.getCurrentUser().getFiles().length).to.equal(0);
        });
    });

    describe('upload() one file', () => {
        Application.reset();
        let app = Application.instance();  
        let user1 = new User("username", "password");
        app.register(user1);
        app.upload(new Code("file.py", "print(\"hello world\")"));

        it('Number of files should equal 1', () => {      
            expect(app.getCurrentUser().getFiles().length).to.equal(1);
        });
    });

    describe('upload() two files', () => {
        Application.reset();
        let app = Application.instance();  
        let user1 = new User("username", "password");
        app.register(user1);

        app.upload(new Code("file.py", "print(\"hello world\")"));
        app.upload(new Code("file2.py", "print(\"hello worlds!!\")"));

        it('Number of files should equal 1', () => {      
            expect(app.getCurrentUser().getFiles().length).to.equal(2);
        });
    });
    
    describe('logout()', () => {
        Application.reset();
        let app = Application.instance(); 
        let user1 = new User("username", "password");
        app.register(user1);
        
        app.logout();

        it('Logging out should not remove the current user from the user list', () => {      
            expect(app.getUsers().size).to.equal(1);
        });

        it('Logging out should make the current user null', () => {      
            expect(app.getCurrentUser()).to.be.null;
        });
    });
    
    describe('selectFiles()', () => {
        Application.reset();
        let app = Application.instance();  
        let user1 = new User("username", "password");
        app.register(user1);

        let code1 = new Code("file.py", "print(\"hello world\")");
        let code2 = new Code("file2.py", "print(\"hello worlds!!\")");

        app.upload(code1);
        app.upload(code2);

        app.selectFiles(code1.getID(), code2.getID());

        it('Selecting files should add to the user\'s selected files', () => {      
            expect(app.getCurrentUser().getSelectedFiles()).to.deep.equal(new SelectedFiles(code1, code2));
        });

        let id: string
        while (id === undefined || id === code1.getID() || id === code2.getID()) {
            id = Math.round((Math.random() * 100000)).toString()
        }

        it('Selecting invalid file with code 1 throws an error', () => {      
            expect(app.selectFiles.bind(app, id, code1.getID())).to.throw();
        });

        it('Selecting invalid file with code 2 throws an error', () => {      
            expect(app.selectFiles.bind(app, code2.getID(), id)).to.throw();
        });
    });

    describe('compare() two files', () => {
        Application.reset();
        let app = Application.instance();  
        let user1 = new User("username", "password");
        app.register(user1);
        let code1 = new Code("file.py", "print(\"hello world\")");
        let code2 = new Code("file2.py", "print(\"hello worlds!!\")");
        app.upload(code1);
        app.upload(code2);
        app.selectFiles(code1.getID(), code2.getID());
        
        app.compare();

        it('Comparing file should add to the user\'s compared files', () => {      
            expect(app.getCurrentUser().getComparisons().length).to.equal(1);
        });
    });

    describe('compare() three files', () => {
        Application.reset();
        let app = Application.instance();  
        let user1 = new User("username", "password");
        app.register(user1);
        let code1 = new Code("file.py", "print(\"hello world\")");
        let code2 = new Code("file2.py", "print(\"hello worlds!!\")");
        let code3 = new Code("file3.py", "print(\"wow a third file\")");
        app.upload(code1);
        app.upload(code2);
        app.upload(code3);

        app.selectFiles(code1.getID(), code2.getID());
        app.compare();

        app.selectFiles(code3.getID(), code2.getID());
        app.compare();

        app.selectFiles(code3.getID(), code1.getID());
        app.compare();

        it('Comparing file should add to the user\'s compared files', () => {      
            expect(app.getCurrentUser().getComparisons().length).to.equal(3);
        });
    });
});
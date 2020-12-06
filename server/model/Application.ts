import Code from "./Code";
import User from "./User";

export default class Application {

    // Map to store users
    private users : Map<string, User>;
    private currentUser?: User;

    private constructor() {
        this.users = new Map<string, User>();
        this.currentUser = null;
    }

    public static instance(): Application {
        if (Application.theApp === undefined) {
            Application.theApp = new Application();
        }
        return this.theApp;
    }

    private static theApp: Application;

    getUsers(): Map<string, User> {
        return this.users;
    }

    getCurrentUser(): User {
        return this.currentUser;
    }

    setCurrentUser(user: User): void {
        let name = user.getUsername();
        if (this.users.has(name)) {
            this.currentUser = this.users.get(name);
        } else {
            throw new Error('Invalid Username');
        }
    }

    register(user: User) : void {
        let name = user.getUsername();
        if (this.users.has(name)) {
            throw new Error('Username already taken');
        } else {
            this.users.set(name, user);
            this.setCurrentUser(user);
        }
    }

    // TODO: User validation?
    login(user: User) : void {
        this.setCurrentUser(user);
    }

    upload(file: Code) : void {
        if (this.currentUser !== null) {
            this.currentUser.uploadFile(file)
        } else {
            throw new Error('Login before uploading files')
        }
    }

    logout() : void {
        this.currentUser = null;
    }

    selectFiles(file1: string, file2: string): void {
        this.currentUser.createSelection(file1, file2);
    }

    compare() : void {
        this.currentUser.makeSummary();
    }
}
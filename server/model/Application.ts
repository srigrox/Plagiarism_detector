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

    // Static singleton instance
    public static instance(): Application {
        if (Application.theApp === undefined) {
            Application.theApp = new Application();
        }
        return this.theApp;
    }

    // Static private singleton field.
    private static theApp: Application;

    // Method to reset the singleton application for testing purposes only.
    static reset(): void {
        this.theApp = undefined;
    }

    // Gets a list of users in the format of a map from the username to the user object.
    getUsers(): Map<string, User> {
        return this.users;
    }

    // Returns the current user.
    getCurrentUser(): User {
        return this.currentUser;
    }

    // Sets the current user.
    setCurrentUser(user: User): void {
        let name = user.getUsername();
        if (this.users.has(name)) {
            this.currentUser = this.users.get(name);
        } else {
            throw new Error('Invalid Username');
        }
    }

    // Registers user.
    register(user: User) : void {
        let name = user.getUsername();
        if (this.users.has(name)) {
            throw new Error('Username already taken');
        } else {
            this.users.set(name, user);
            this.setCurrentUser(user);
        }
    }

    // Logins user.
    login(user: User) : void {
        this.setCurrentUser(user);
    }

    // Uploads code to the current user's list of files.
    upload(file: Code) : void {
        if (this.currentUser !== null) {
            this.currentUser.uploadFile(file)
        } else {
            throw new Error('Login before uploading files')
        }
    }

    // Logs out the user.
    logout() : void {
        this.currentUser = null;
    }

    // Selects files to compare based on the ID.
    selectFiles(file1: string, file2: string): void {
        this.currentUser.createSelection(file1, file2);
    }

    // Compares the current user's selected files.
    compare() : void {
        this.currentUser.makeSummary();
    }
}
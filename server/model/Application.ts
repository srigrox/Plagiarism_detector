import User from "./User";

class Application{

    // Map to store users
    private users : Map<string, User>;
    private currentUser?: User;

    private constructor(users : Map<string, User>, currentUser: User) {
        this.users = users;
        this.currentUser = currentUser;
    }

    public static instance(users: Map<string, User>, currentUser?: User): Application {
        if (Application.theApp === undefined) {
            Application.theApp = new Application(users, currentUser);
        }
        return this.theApp;
    }

    private static theApp: Application;

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

    upload() : void {

    }

    logout() : void {
        this.currentUser = null;
    }

    selectFiles(): void {

    }

    compare() : void {

    }

}

export default Application
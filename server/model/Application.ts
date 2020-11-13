import User from "./User";

class Appication{

    users : Array<User>;
    currentUser?: User;

    constructor(users : Array<User>, currentUser: User) {
        this.users = users;
        this.currentUser = currentUser;
    }

    getCurrentUser() : User {
        return this.currentUser;
    }

    register() : void {

    }

    login() : void {

    }

    upload() : void {

    }

    logout() : void {

    }

    selectFiles(): void {

    }

    compare() : void {

    }

}

export default Application
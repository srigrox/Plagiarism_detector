class Appication{

    users : Array<User>;
    currentUser?: User;

    constructor(users : Array<User>, currentUser: User) {
        this.users = users;
        this.currentUser = currentUser;
    }

    function getCurrentUser() : User{
        return this.currentUser;
    }

    function register() : void {

    }

    function login() : void {

    }

    function upload() : void {

    }

    function logout() : void {

    }

    function selectFiles(): void {

    }

    function compare() : void {

    }

}

export default Application
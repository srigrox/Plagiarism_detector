export interface User {
    username: string;
    password: string;
}

export interface PlagiarismAppState{
    user: User;
    isLoggedIn: boolean;
    showLogin: boolean;
    showSignup: boolean;
    currentMenu: string;
}
export interface TokenServiceInterface {
    userId: number;
    userEmail: string;
    userRole: string;
    readonly getToken: string;

    setUserId(userId: number): setUserId;

    getUserId(): any;

    setUserEmail(userEmail: string): setUserEmail;

    getUserEmail(): any;

    setUserRole(userRole: string): setUserRole;

    getUserRole(): any;
}
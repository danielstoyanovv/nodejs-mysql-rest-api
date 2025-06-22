export interface TokenManagerInterface {
    token: string;

    /**
     * Set authentication token
     * @param {string} token
     * @return {this}
     */
    setToken(token: string): setToken;

    /**
     * Get authentication token
     * @return {string}
     */
    getToken(): any;

    /**
     * Check Is authentication token expired
     * @return {boolean}
     */
    isExpired(): boolean;

    /**
     * Check if authentication token data includes admin
     * @return {boolean}
     */
    includesAdmin(): boolean;
}
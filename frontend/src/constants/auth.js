export default {
    ACCESS_TOKEN_HEADER: () => `Bearer ${sessionStorage.getItem('currentUser')}`,
    USERNAME: "username",
    IS_ADMIN: "isAdmin",
    ACCESS_TOKEN: 'currentUser',
    REFRESH_TOKEN: 'currentUserRefresh'
}
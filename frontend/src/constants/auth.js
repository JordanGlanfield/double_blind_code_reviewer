export default {
    ACCESS_TOKEN_HEADER: () => `Bearer ${sessionStorage.getItem('currentUser')}`,
    USERNAME: "username",
    ACCESS_TOKEN: 'currentUser',
    REFRESH_TOKEN: 'currentUserRefresh'
}
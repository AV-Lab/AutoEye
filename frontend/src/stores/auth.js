import gql from 'graphql-tag';
import { defineStore } from 'pinia';
import apolloClient from '../plugins/apollo';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        loggedIn: localStorage.getItem('loggedIn') ?? false,
        user: JSON.parse(localStorage.getItem('user'))
    }),

    actions: {
        async login(credentials) {
            const AUTHENTICATE_MUTATION = gql`
                mutation authenticate($authInput: AuthInput!) {
                    authenticate(authInput: $authInput) {
                        accessToken
                        user {
                            id
                            username
                        }
                    }
                }
            `;

            await apolloClient
                .mutate({
                    mutation: AUTHENTICATE_MUTATION,
                    variables: { authInput: credentials }
                })
                .then(({ data }) => {
                    if (!data) return;

                    this.loggedIn = true;

                    localStorage.setItem('token', `Bearer ${data.authenticate.accessToken}`);
                    localStorage.setItem('loggedIn', this.loggedIn);
                    localStorage.setItem('user', JSON.stringify(data.authenticate.user));
                });

            await apolloClient.resetStore();
        },

        async logout() {
            // const { logout } = (
            //     await apolloClient.mutate({
            //         mutation: gql`
            //             mutation {
            //                 logout
            //             }
            //         `
            //     })
            // ).data;

            // if (logout) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('loggedIn');

            this.loggedIn = false;
            this.user = null;

            await apolloClient.resetStore();
            // }
        }
    },

    getters: {}
});

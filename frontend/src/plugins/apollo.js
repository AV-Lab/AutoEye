import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { useErrorsStore } from '@/stores/errors';

// HTTP connection to the API
const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: 'http://localhost:8000/graphql',
    credentials: 'include'
});

const errorHandler = onError(({ graphQLErrors }) => {
    if (graphQLErrors)
        useErrorsStore().$state = {
            message: graphQLErrors[0].message
        };
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: localStorage.getItem('token')
        }
    };
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
const apolloClient = new ApolloClient({
    link: authLink.concat(errorHandler.concat(httpLink)),
    cache
});

export default apolloClient;

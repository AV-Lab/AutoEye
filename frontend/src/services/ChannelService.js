import gql from 'graphql-tag';
import apolloClient from '../plugins/apollo';

export async function getChannels() {
    const GET_ALL_QUERY = gql`
        query channels {
            channels {
                id
                name
                order
            }
        }
    `;

    return await apolloClient.query({ query: GET_ALL_QUERY, fetchPolicy: 'no-cache' }).then(({ data }) => {
        return data.channels;
    });
}

export async function createChannel(name, order) {
    const CREATE_MUTATION = gql`
        mutation createChannel($createChannelInput: CreateChannelInput!) {
            createChannel(createChannelInput: $createChannelInput) {
                id
            }
        }
    `;

    return await apolloClient
        .mutate({
            mutation: CREATE_MUTATION,
            variables: {
                createChannelInput: {
                    name,
                    order
                }
            }
        })
        .then(({ data }) => {
            return {
                data: data.createChannel
            };
        })
        .catch((errors) => {
            const clientErrors = [];

            errors.graphQLErrors.forEach((error) => {
                clientErrors.push(error.message[0]);
            });

            return {
                errors: clientErrors
            };
        });
}

export async function updateChannel(id, name, order) {
    const UPDATE_MUTATION = gql`
        mutation updateChannel($updateChannelInput: UpdateChannelInput!) {
            updateChannel(updateChannelInput: $updateChannelInput) {
                id
            }
        }
    `;

    return await apolloClient
        .mutate({
            mutation: UPDATE_MUTATION,
            variables: {
                updateChannelInput: {
                    id,
                    name,
                    order
                }
            }
        })
        .then(({ data }) => {
            return {
                data: data.updateChannel
            };
        })
        .catch((errors) => {
            const clientErrors = [];

            errors.graphQLErrors.forEach((error) => {
                clientErrors.push(error.message[0]);
            });

            return {
                errors: clientErrors
            };
        });
}

export async function deleteChannels(ids) {
    if (!Array.isArray(ids)) ids = [ids];

    const DELETE_MANY_MUTATION = gql`
        mutation deleteChannels($channelIds: [String!]!) {
            deleteChannels(channelIds: $channelIds)
        }
    `;

    return await apolloClient
        .mutate({
            mutation: DELETE_MANY_MUTATION,
            variables: {
                channelIds: ids
            }
        })
        .then(({ data }) => {
            return data.deleteChannels;
        })
        .catch((errors) => {
            const clientErrors = [];

            errors.graphQLErrors.forEach((error) => {
                clientErrors.push(error.message[0]);
            });

            return {
                errors: clientErrors
            };
        });
}

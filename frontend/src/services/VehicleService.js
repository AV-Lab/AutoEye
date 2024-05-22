import gql from 'graphql-tag';
import apolloClient from '../plugins/apollo';

export async function getVehicles() {
    const GET_ALL_QUERY = gql`
        query vehicles {
            vehicles {
                id
                name
                channels {
                    id
                    name
                    order
                }
                order
            }
        }
    `;

    return await apolloClient.query({ query: GET_ALL_QUERY, fetchPolicy: 'no-cache' }).then(({ data }) => {
        return data.vehicles;
    });
}

export async function createVehicle(name, channels, order) {
    const CREATE_MUTATION = gql`
        mutation createVehicle($createVehicleInput: CreateVehicleInput!) {
            createVehicle(createVehicleInput: $createVehicleInput) {
                id
            }
        }
    `;

    return await apolloClient
        .mutate({
            mutation: CREATE_MUTATION,
            variables: {
                createVehicleInput: {
                    name,
                    channels,
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

export async function updateVehicle(id, name, channels, order) {
    const UPDATE_MUTATION = gql`
        mutation updateVehicle($updateVehicleInput: UpdateVehicleInput!) {
            updateVehicle(updateVehicleInput: $updateVehicleInput) {
                id
            }
        }
    `;

    return await apolloClient
        .mutate({
            mutation: UPDATE_MUTATION,
            variables: {
                updateVehicleInput: {
                    id,
                    name,
                    channels,
                    order
                }
            }
        })
        .then(({ data }) => {
            return {
                data: data.updateVehicle
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

export async function deleteVehicles(ids) {
    if (!Array.isArray(ids)) ids = [ids];

    const DELETE_MANY_MUTATION = gql`
        mutation deleteVehicles($vehicleIds: [String!]!) {
            deleteVehicles(vehicleIds: $vehicleIds)
        }
    `;

    return await apolloClient
        .mutate({
            mutation: DELETE_MANY_MUTATION,
            variables: {
                vehicleIds: ids
            }
        })
        .then(({ data }) => {
            return data.deleteVehicles;
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

import { gql } from 'apollo-boost'

export const All_PROJECTS = gql`
            query {
                projects{
                    _id,
                    name,
                    code,
                    smj{
                        _id,
                        firstName,
                        lastName
                    },
                    dsmj{
                        _id,
                        firstName,
                        lastName
                    },
                    po{
                        _id,
                        firstName,
                        lastName
                    },
                    spo{
                        _id,
                        firstName,
                        lastName
                    },
                    status,
                    createdAt
                }
            }
`
export const ADD_PROJECT = gql`
    mutation createProject($input: ProjectInput){
        createProject(input:$input){
            project {
                _id,
                name
            },
            error{
                name,
                message
            }
        }
    }
`

export const EDIT_PROJECT = gql`
    mutation updateProject($input: updateProjectInput){
        updateProject(input:$input){
            project {
                _id,
                name
            },
            error{
                name,
                message
            }
        }
    }
`
export const DELETE_PROJECT = gql`
    mutation removeProject($input: RemoveProjectInput!){
        removeProject(input:$input){
                message,
            error{
                name,
                message
            }
        }
    }
`


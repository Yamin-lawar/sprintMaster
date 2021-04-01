import { gql } from 'apollo-boost'

export const All_SPRINT = gql`
            query {
                sprints{
                    _id,
                    name,
                    code,
                    startDate,
                    endDate,
                    hours,
                    createdBy{
                    firstName,
                    lastName
                    }
                    status
                }
            }
`
export const ACTIVE_SPRINT = gql`
     query{
        activeSprint{
            _id,
            name,
            code,
            startDate,
            endDate,
            hours,
            createdBy{
            firstName,
            lastName
            },
            status,
            completion,
            status,
            createdAt,
            projects{
            _id,
            name,
            code,
            allocatedUsers{
                _id,
                firstName,
                lastName,
                email,
                avtaar
            },
            smj{
                firstName,
                lastName
            },
            dsmj{
                firstName,
                lastName
            },
            po{
                firstName,
                lastName
            },
            spo{
                firstName,
                lastName
            },
            poRanking,
            gurujiRanking,
            projectWiseAllocation,
            approvalStatus,
            completion,
            task{
                _id,
                name,
                user{
                _id
                firstName,
                lastName,
                avtaar
                },
                hours,
                createdAt,
                createdBy{
                _id,
                firstName,
                lastName
                },
                completion,
                status,
                comments{
                _id,
                user{
                    _id,
                    firstName,
                    lastName
                },
                comment,
                createdAt
                }
            }
            }
            
        }
     }
`

export const ADD_SPRINT = gql`
    mutation createSprint($input: SprintInput){
        createSprint(input:$input){
            message,
            error{
            name,
            message
            }
        }
    }
`
export const EDIT_SPRINT = gql`
    mutation updateSprint($input: updateSprintInput){
        updateSprint(input:$input){
            message,
            error{
                name,
                message
            }
        }
    }
`

export const DELETE_SPRINT = gql`
    mutation removeSprint($input: deleteSprintInput!){
        removeSprint(input:$input){
                message,
            error{
                name,
                message
            }
        }
    }
`



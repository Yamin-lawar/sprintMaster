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



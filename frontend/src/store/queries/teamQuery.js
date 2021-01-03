import { gql } from 'apollo-boost'

export const All_TEAMS = gql`
    query {
            teams{
                _id,
                name,
                skills,
                createdAt
            }
          }
`

export const ADD_TEAM = gql`
    mutation createTeam($input: AddTeamInput){
        createTeam(input:$input){
            team{
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
export const EDIT_TEAM = gql`
    mutation updateTeam($input: UpdateTeamInput){
        updateTeam(input:$input){
            team{
                _id,
                name
            }
            error{
                message,
                name
            }
        }
    }
`
export const DELETE_TEAM = gql`
    mutation removeTeam($input: RemoveTeamInput!){
        removeTeam(input:$input){
                message,
            error{
                name,
                message
            }
        }
    }
`

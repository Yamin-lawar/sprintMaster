import { gql } from 'apollo-boost'

export const All_USERS = gql`
    query {
        users{
            _id,
            firstName,
            email,
            lastName,
            skills,
            mobileNo,
            avtaar,
            team{
                _id,
                name,
                skills
            },
    }}
`

export const ADD_USER = gql`
    mutation createUser($input: UserInput!){
        createUser(input: $input){
            user{
                _id,
                firstName,
                lastName,
                email,
                mobileNo,
                avtaar
            },
            error{
                name,
                message
            }
        }
    }
`

export const EDIT_USER = gql`
    mutation updateUser($input: UpdateUserInput!){
        updateUser(input: $input){
            user{
                _id,
                firstName,
                lastName,
                email,
                mobileNo,
                avtaar
            },
            error{
                name,
                message
            }
        }
    }
`

export const DELETE_USER = gql`
    mutation removeUser($input: RemoveUserInput!){
        removeUser(input:$input){
            message,
            error{
                name,
                message
            }
        }
    }
`


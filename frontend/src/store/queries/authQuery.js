import { gql } from 'apollo-boost'

export const LOGIN = gql`
    mutation login($input: loginInput!){
        login(input: $input){
            user{
                _id,
                firstName,
                lastName,
                email,
                mobileNo,
                avtaar
                
            },
            token,
            error{
                name,
                message
            }
        }
    }
`

export const CURRENT_USER = gql`
    query users($id: ID!){
        users(_id: $id){
            _id,
            firstName,
            email,
            lastName,
            skills,
            mobileNo,
            avtaar
        }
    }
`
import { gql } from 'apollo-boost'

export const All_USERS = gql`
    query {users{
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
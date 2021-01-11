import { gql } from 'apollo-boost'

export const All_SPRINT = gql`
            query {
                sprints{
                    _id,
                    name,
                    code,
                    startDate,
                    endDate,
                    sprintHours,
                    createdBy{
                    firstName,
                    lastName
                    }
                    status
                }
            }
`


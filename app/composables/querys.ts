import gql from 'graphql-tag'

export const USER_LOGIN_QUERY = gql`
    query UserByLogin($login: String!, $password: String!) {
        userByLogin(login: $login, password: $password) {
            id
            login
            email
            name
            role
            token
        }
    }
`
export const USER_ID_QUERY = gql`
    query UserById($id: ID!) {
        userById(id: $id) {
            id
            name
        }
    }
`
export const USERS_QUERY = gql`
    query Users {
        users {
            id
            name
            email
        }
    }
`
export const PROJECTS_QUERY = gql`
    query ProjectsByUserId($userId: ID!) {
        projectsByUserId(userId: $userId) {
            id
            dance {
                group
                title
            }
            members {
                userId
                part
            }
            link
        }
    }
`
export const PROJECTS_ID_QUERY = gql`
    query Project($id: ID!) {
        project(id: $id) {
            id
            dance {
                group
                title
            }
            members {
                userId
                part
            }
            link
        }
    }
`
export const ADD_PROJECT = gql`
  mutation AddProject($dance: DanceInput!, $link: String!, $members: [MemberInput!]!) {
    addProject(dance: $dance, link: $link, members: $members) {
      id
    }
  }
`
export const EDIT_PROJECT = gql`
  mutation UpdateProject($id: ID!, $dance: DanceInput!, $link: String!, $members: [MemberInput!]!) {
    updateProject(id: $id, dance: $dance, link: $link, members: $members) {
      id
    }
  }
`
export const DEL_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`
export const COSTUMES_ID_QUERY = gql`
    query Costumes($id: ID!) {
        costumes(id: $id) {
            costumes {
                userId
                things {
                    id
                    link
                    status
                }
            }
        }
    }
`
export const ADD_THING = gql`
  mutation AddThing($projectId: ID!, $userId: ID!, $thing: ThingInput!) {
    addThing(projectId: $projectId, userId: $userId, thing: $thing) {
      id
    }
  }
`
export const EDIT_THING = gql`
  mutation UpdateThing($projectId: ID!, $userId: ID!, $thingId: ID!, $thing: ThingInput!) {
    updateThing(projectId: $projectId, userId: $userId, thingId: $thingId, thing: $thing) {
      id
    }
  }
`

export const DEL_THING = gql`
  mutation DeleteThing($projectId: ID!, $userId: ID!, $thingId: ID!) {
    deleteThing(projectId: $projectId, userId: $userId, thingId: $thingId)
    {
      id
    }
  }
`
export const EVENTS_ID_QUERY = gql`
    query Events($id: ID!) {
        events(id: $id) {
            events {
                id
                title
                datetimeStart
                datetimeEnd
                color
                desc {
                    address
                    price
                    comment
                }
            }
        }
    }
`
export const ADD_EVENT = gql`
  mutation AddEvent($projectId: ID! $event: EventInput!) {
    addEvent(projectId: $projectId, event: $event) {
      id
    }
  }
`
export const EDIT_EVENT = gql`
  mutation UpdateEvent($projectId: ID!, $eventId: ID! $event: EventInput!) {
    updateEvent(projectId: $projectId, eventId: $eventId, event: $event) {
      id
    }
  }
`
export const DEL_EVENT = gql`
  mutation DeleteEvent($projectId: ID!, $eventId: ID!) {
    deleteEvent(projectId: $projectId, eventId: $eventId)
    {
      id
    }
  }
`

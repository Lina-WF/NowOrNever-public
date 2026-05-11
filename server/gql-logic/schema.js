export const schema = `
  # --- USER ---
  type User {
    id: ID!
    login: String!
    password: String!
    email: String!
    name: String!
    role: String!
    token: String
  }

  # --- PROJECT ---
  type Dance {
    group: String!
    title: String!
  }

  type Member {
    userId: ID!
    part: String!
  }

  type Proj {
    id: ID!
    dance: Dance!
    members: [Member!]!
    link: String!
  }

  # --- EVENTS ---
  type EventDesc {
    address: String
    price: Int
    comment: String
  }

  type Event {
    id: ID!
    title: String!
    datetimeStart: DateTime!
    datetimeEnd: DateTime!
    color: String!
    desc: EventDesc!
  }

  type Events {
    id: ID! # Совпадает с Proj.id
    events: [Event!]!
  }

  # --- COSTUMES ---
  type Thing {
    id: ID!
    link: String!
    status: String!
  }

  type UserCostume {
    userId: ID!
    things: [Thing!]!
  }

  type Costumes {
    id: ID! # Совпадает с Proj.id
    costumes: [UserCostume!]!
  }

  # --- INPUTS ---
  input DanceInput {
    group: String!
    title: String!
  }

  input MemberInput {
    userId: ID!
    part: String!
  }

  input EventDescInput {
    address: String
    price: Int
    comment: String
  }

  input EventInput {
    title: String!
    datetimeStart: DateTime!
    datetimeEnd: DateTime!
    color: String!
    desc: EventDescInput!
  }

  input ThingInput {
    link: String!
    status: String!
  }

  # --- QUERIES ---
  type Query {
    # Users
    users: [User!]!
    userById(id: ID!): User
    userByLogin(login: String!, password: String!): User

    # Projects
    project(id: ID!): Proj
    projectsByUserId(userId: ID!): [Proj!]! 

    # Events
    events(id: ID!): Events

    # Costumes
    costumes(id: ID!): Costumes
  }

  # --- MUTATIONS ---
  type Mutation {
    # Project Mutations
    addProject(dance: DanceInput!, link: String!, members: [MemberInput!]!): Proj!
    updateProject(id: ID!, dance: DanceInput!, link: String!, members: [MemberInput!]!): Proj!
    deleteProject(id: ID!): ID!

    # Event Mutations
    addEvent(projectId: ID!, event: EventInput!): Events!
    updateEvent(projectId: ID!, eventId: ID!, event: EventInput!): Events!
    deleteEvent(projectId: ID!, eventId: ID!): Events!

    # Costume Mutations
    addThing(projectId: ID!, userId: ID!, thing: ThingInput!): Costumes!
    updateThing(projectId: ID!, userId: ID!, thingId: ID!, thing: ThingInput!): Costumes!
    deleteThing(projectId: ID!, userId: ID!, thingId: ID!): Costumes!
  }

  scalar DateTime
  scalar Upload
`

const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Orchestra {
    _id: ID!
    name: String!
    owner: User!
    members: [Member!]!
    channels: [Channel!]
  }

  type Member {
    _id: ID!
    orchestra: Orchestra!
    user: User!
  }

  type Invite {
    _id: ID!
    email: String!
    subject: Orchestra!
    from: User!
    to: User
    createdAt: String!
    pending: Boolean!
  }

  type User {
    _id: ID!
    name: String
    email: String
    password: String
    createdOrchestras: [Orchestra!]
    memberOf: [Orchestra!]
    sentInvites: [Invite!]
    receivedInvites: [Invite!]
    firstName: String
    lastName: String
    city: String
    birthdate: String
    bio: String
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  input UserInput {
    firstName: String
    lastName: String
    city: String
    birthdate: String
    bio: String
  }

  input OrchestraInput {
    name: String
  }

  enum MessageFormat {
    PLAIN_TEXT
    JSON
    SC_RAW
    SC_LANG
  }

  enum MessageContext {
    CHAT
    SUPERCOLLIDER
  }

  type Channel {
    _id: ID!
    name: String #public
    orchestra: Orchestra!
    members: [Member!]
  }

  union MessageTarget = Channel | Member

  type Message {
    format: MessageFormat!
    context: MessageContext!
    body: String!
    from: Member!
    to: MessageTarget
  }

  input MessageFilter {
    targetType: __typename
    targetId: String
    context: MessageContext,
    formats: [MessageFormat!]
  }

  input MessageInput {
    targetType: __typename!
    targetId: String!
    format: MessageFormat!
    context: MessageContext!
    body: String!
  }

  # This type specifies the entry points into our API.
  type Query {
    login(email: String!, password: String!): AuthData!
    user: User!
    orchestras: [Orchestra!]!
    orchestraById(orchestraId: String!): Orchestra!
    members(orchestraId: String!): [Member!]
    invites: [Invite!]
    messages(orchestraId: String!, messageFilter: MessageFilter): [Message!]
  }

  # The mutation root type, used to define all mutations.
  type Mutation {
    register(name: String!, email: String!, password: String!): AuthData!
    updateUser(userInput: UserInput!): User
    createOrchestra(name: String!): Orchestra!
    updateOrchestra(
      orchestraId: String!
      orchestraInput: OrchestraInput!
    ): Orchestra!
    deleteOrchestra(orchestraId: String!): Orchestra
    sendInvite(orchestraId: String!, email: String!): Invite!
    acceptInvite(inviteId: String!): Member!
    denyInvite(inviteId: String!): Invite!
    sendMessage(orchestraId: String!, messageInput: messageInput!): Message!
  }

  # The subscription root type, used to define all subscriptions.
  type Subscription {
    newInvite: Invite!
    newMember(orchestraId: String!): Member!
    newMessage(orchestraId: String!, messageFilter: MessageFilter): Message!
  }
`;

module.exports = typeDefs;

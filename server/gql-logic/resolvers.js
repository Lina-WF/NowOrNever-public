import fs from 'node:fs'
import path from 'node:path'
import jwt from 'jsonwebtoken'
import { verifyAdmin, verifyUser } from '../utils/auth'
import { deleteFile } from '../utils/files'
import { decodePassword } from '../utils/passwords'
import { GraphQLUpload } from 'graphql-upload-minimal'

const readData = (name) => {
  const filePath = path.resolve(process.cwd(), 'data', `${name}.json`)
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

const saveData = (name, data) => {
  const filePath = path.resolve(process.cwd(), 'data', `${name}.json`)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

let users = readData('users')
let projs = readData('projects')
let eventsData = readData('events')
let costumesData = readData('costumes')

export const resolvers = {
  DateTime: {
    __parseValue(value) { return value },
    __serialize(value) { return value },
    __parseLiteral(ast) { return ast.value },
  },
  Upload: GraphQLUpload,

  Query: {
    users: () => users,
    userById: (_, { id }) => users.find(u => +u.id === +id),
    userByLogin: async (_, { login, password }, context) => {
      const event = context.event
      const config = useRuntimeConfig(event)
      const user = users.find(u => u.login === login)
      if (user) {
        const is_valid = await decodePassword(context.event, user.password, password)
        if (!is_valid) {
          return null
        }
        else {
          const token = jwt.sign(
            {
              id: user.id,
              login: user.login,
              role: user.role,
            },
            config.jwtSecret,
            { expiresIn: '30d' },
          )

          return {
            ...user,
            token,
          }
        }
      }
      else return null
    },

    project: (_, { id }) => projs.find(p => +p.id === +id),
    projectsByUserId: (_, { userId }) => {
      return projs.filter(proj =>
        proj.members.some(member => +member.userId === +userId),
      )
    },

    events: (_, { id }) => eventsData.find(e => +e.id === +id),

    costumes: (_, { id }) => costumesData.find(c => +c.id === +id),
  },

  Mutation: {
    // --- Projects ---
    addProject: (_, { dance, link, members }, context) => {
      verifyAdmin(context.event)

      const newProj = { id: Date.now(), dance, members, link }
      projs.push(newProj)
      eventsData.push({ id: newProj.id, events: [] })
      costumesData.push({ id: newProj.id, costumes: [] })

      saveData('projects', projs)
      saveData('events', eventsData)
      saveData('costumes', costumesData)

      if (globalThis.broadcastWS) {
        globalThis.broadcastWS({
          type: 'projects',
          projectId: +newProj.id,
        })
      }
      return newProj
    },
    updateProject: (_, { id, dance, link, members }, context) => {
      verifyAdmin(context.event)
      const index = projs.findIndex(p => +p.id === +id)

      const updatedProj = {
        ...projs[index],
        dance,
        link,
        members,
      }
      projs[index] = updatedProj

      saveData('projects', projs)
      if (globalThis.broadcastWS) {
        globalThis.broadcastWS({
          type: 'projects',
          projectId: +id,
        })
      }

      return updatedProj
    },
    deleteProject: (_, { id }, context) => {
      verifyAdmin(context.event)

      const projectCostumes = costumesData.find(c => +c.id === +id)
      if (projectCostumes) {
        projectCostumes.costumes.forEach((userCostume) => {
          const userId = userCostume.userId
          userCostume.things.forEach((thing) => {
            if (thing.link) {
              deleteFile(thing.link, userId, userId)
            }
          })
        })
      }

      projs = projs.filter(p => +p.id !== +id)
      eventsData = eventsData.filter(e => +e.id !== +id)
      costumesData = costumesData.filter(c => +c.id !== +id)

      saveData('projects', projs)
      saveData('events', eventsData)
      saveData('costumes', costumesData)

      if (globalThis.broadcastWS) {
        globalThis.broadcastWS({
          type: 'projects',
          projectId: +id,
        })
      }
      return id
    },

    // --- Events ---
    addEvent: (_, { projectId, event }, context) => {
      verifyAdmin(context.event)

      const list = eventsData.find(e => +e.id === +projectId)
      if (list) {
        const newEvent = {
          ...event,
          id: Date.now(),
          desc: {
            ...event.desc,
            comment: event.desc.comment || '',
          },
        }
        list.events.push(newEvent)
        saveData('events', eventsData)
        if (globalThis.broadcastWS) {
          globalThis.broadcastWS({
            type: 'events',
            eventsId: +projectId,
          })
        }
        return list
      }
    },
    updateEvent: (_, { projectId, eventId, event }, context) => {
      verifyAdmin(context.event)

      const list = eventsData.find(e => +e.id === +projectId)
      if (list) {
        const index = list.events.findIndex(e => +e.id === +eventId)
        if (index !== -1) {
          list.events[index] = {
            ...event,
            id: eventId,
            desc: {
              ...event.desc,
              comment: event.desc.comment || '',
            },
          }
          saveData('events', eventsData)
          if (globalThis.broadcastWS) {
            globalThis.broadcastWS({
              type: 'events',
              eventsId: +projectId,
            })
          }
        }
        return list
      }
    },
    deleteEvent: (_, { projectId, eventId }, context) => {
      verifyAdmin(context.event)

      const list = eventsData.find(e => +e.id === +projectId)
      if (list) {
        list.events = list.events.filter(e => +e.id !== +eventId)
        saveData('events', eventsData)
        if (globalThis.broadcastWS) {
          globalThis.broadcastWS({
            type: 'events',
            eventsId: +projectId,
          })
        }
      }
      return list
    },

    // --- Costumes ---
    addThing: async (_, { projectId, userId, thing }, context) => {
      if (verifyUser(context.event).id !== +userId) {
        const error = new Error('Ой, а у вас прав нет :(');
        (error).extensions = {
          code: 403,
        }
        throw error
      }

      const projCostumes = costumesData.find(c => +c.id === +projectId)

      if (projCostumes) {
        let userSection = projCostumes.costumes.find(u => +u.userId === +userId)
        if (!userSection) {
          userSection = { userId, things: [] }
          projCostumes.costumes.push(userSection)
        }

        userSection.things.push({
          ...thing,
          id: Date.now(),
        })

        saveData('costumes', costumesData)
        if (globalThis.broadcastWS) {
          globalThis.broadcastWS({
            type: 'costumes',
            costumesId: +projectId,
          })
        }

        return projCostumes
      }
    },
    updateThing: (_, { projectId, userId, thingId, thing }, context) => {
      if (verifyUser(context.event).id !== +userId) {
        const error = new Error('Ой, а у вас прав нет :(');
        (error).extensions = {
          code: 403,
        }
        throw error
      }

      const projCostumes = costumesData.find(c => +c.id === +projectId)
      if (projCostumes) {
        const userSection = projCostumes.costumes.find(u => +u.userId === +userId)
        if (userSection) {
          const index = userSection.things.findIndex(t => +t.id === +thingId)
          if (index !== -1) {
            const oldThing = userSection.things[index]
            if (thing.link && oldThing.link !== thing.link) {
              deleteFile(context.event, oldThing.link, userId)
            }
            userSection.things[index] = {
              ...thing,
              id: thingId,
            }

            saveData('costumes', costumesData)
            if (globalThis.broadcastWS) {
              globalThis.broadcastWS({
                type: 'costumes',
                costumesId: +projectId,
              })
            }
          }
        }
        return projCostumes
      }
    },
    deleteThing: (_, { projectId, userId, thingId }, context) => {
      if (verifyUser(context.event).id !== +userId) {
        const error = new Error('Ой, а у вас прав нет :(');
        (error).extensions = {
          code: 403,
        }
        throw error
      }

      const projCostumes = costumesData.find(c => +c.id === +projectId)
      if (projCostumes) {
        const userSection = projCostumes.costumes.find(u => +u.userId === +userId)
        if (userSection) {
          deleteFile(context.event, userSection.things.find(t => +t.id === +thingId).link, userId)
          userSection.things = userSection.things.filter(t => +t.id !== +thingId)
          if (userSection.things.length === 0) {
            const userSectionIndex = projCostumes.costumes.findIndex(u => +u.userId === +userId)
            projCostumes.costumes.splice(userSectionIndex, 1)
          }

          saveData('costumes', costumesData)
          if (globalThis.broadcastWS) {
            globalThis.broadcastWS({
              type: 'costumes',
              costumesId: +projectId,
            })
          }
        }
      }
      return projCostumes
    },
  },
}

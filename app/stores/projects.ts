import { defineStore } from 'pinia'
import { ADD_PROJECT, DEL_PROJECT, EDIT_PROJECT, PROJECTS_ID_QUERY, PROJECTS_QUERY } from '~/composables/querys'

export const useProjectsStore = defineStore('projects', () => {
  const { $apollo } = useNuxtApp()

  async function findUserProjects(id: number) {
    if (!useNuxtApp().$apollo?.defaultClient) {
      setTimeout(() => findUserProjects(id), 500)
      return
    }

    const res = await $apollo.defaultClient.query({
      query: PROJECTS_QUERY,
      variables: { userId: id },
      fetchPolicy: 'network-only',
    })

    if (res.data.projectsByUserId) {
      return res.data.projectsByUserId
    }
  }

  async function findProject(id: number) {
    try {
      const res = await $apollo.defaultClient.query({
        query: PROJECTS_ID_QUERY,
        variables: { id: id },
        fetchPolicy: 'network-only',
      })
      return res.data.project
    }
    catch (err) {
      const error = err as GraphQLErrorResponse
      return useRouter().push({
        path: '/error',
        state: {
          reason: error.graphQLErrors[0]?.message,
          code: error.graphQLErrors[0]?.extensions.code,
        },
      })
    }
  }

  async function newProject(dance: Dance, link: string, members: Member[]) {
    try {
      const res = await $apollo.defaultClient.mutate({
        mutation: ADD_PROJECT,
        variables: {
          dance: dance,
          link: link,
          members: members,
        },
      })
      return res.data.addProject
    }
    catch (err) {
      const error = err as { graphQLErrors: { extensions: { code: number }, message: string }[] }
      return useRouter().push({
        path: '/error',
        state: { reason: error.graphQLErrors[0]?.message, code: error.graphQLErrors[0]?.extensions.code },
      })
    }
  }

  async function editProject(id: number, dance: Dance, link: string, members: Member[]) {
    try {
      const res = await $apollo.defaultClient.mutate({
        mutation: EDIT_PROJECT,
        variables: {
          id: id,
          dance: dance,
          link: link,
          members: members,
        },
      })
      return res.data.updateProject
    }
    catch (err) {
      const error = err as { graphQLErrors: { extensions: { code: number }, message: string }[] }
      return useRouter().push({
        path: '/error',
        state: { reason: error.graphQLErrors[0]?.message, code: error.graphQLErrors[0]?.extensions.code },
      })
    }
  }

  async function delProject(id: number) {
    try {
      const res = await $apollo.defaultClient.mutate({
        mutation: DEL_PROJECT,
        variables: {
          id: id,
        },
      })
      return res.data.deleteProject
    }
    catch (err) {
      const error = err as { graphQLErrors: { extensions: { code: number }, message: string }[] }
      return useRouter().push({
        path: '/error',
        state: { reason: error.graphQLErrors[0]?.message, code: error.graphQLErrors[0]?.extensions.code },
      })
    }
  }

  return { findUserProjects, findProject, newProject, editProject, delProject }
})

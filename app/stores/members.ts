import { defineStore } from 'pinia'

export const useMembersStore = defineStore('members', () => {
  const usersStore = useUsersStore()
  const projectsStore = useProjectsStore()
  // const { $apollo } = useNuxtApp()

  async function findMembers(id: number) {
    const res = await projectsStore.findProject(id)
    if (!res) return []
    const members = await Promise.all(res.members.map(async (member: Member) => {
      const user = await usersStore.findUser(member.userId)
      return { ...user, part: member.part }
    }))

    return members
  }

  function sortMembers(members: NamedMember[], user: User | undefined) {
    if (user && members) {
      const userMember = members.find(member => member.id === user.id)
      const otherMembers = members.filter(member => member.id !== user.id)
      return [userMember, ...otherMembers]
    }
    return members
  }

  return { findMembers, sortMembers }
})

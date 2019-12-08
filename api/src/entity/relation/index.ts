export function getUsersPostsKey(userId: string, postId?: string) {
  if (postId === undefined) {
    return `USERS-POSTS-userId#${userId}`
  }

  return `USERS-POSTS-userId#${userId}-postId#${postId}`
}

const usersPostsRegExp = new RegExp(/USERS-POSTS-userId#\w+-postId#(.*)/)
export function getPostIdFromUsersPostsKey(key: string) {
  const matches = usersPostsRegExp.exec(key)
  if (matches === null) {
    return null
  }
  return matches[1]
}

export function getCategoriesPostsKey(categoryId: string, postId?: string) {
  if (postId === undefined) {
    return `CATEGORIES-POSTS-categoryId#${categoryId}`
  }

  return `CATEGORIES-POSTS-categoryId#${categoryId}-postId#${postId}`
}

const categoriesPostsRegExp = new RegExp(/CATEGORIES-POSTS-categoryId#\w+-postId#(.*)/)
export function getPostIdFromCategoriesPostsKey(key: string) {
  const matches = categoriesPostsRegExp.exec(key)
  if (matches === null) {
    return null
  }
  return matches[1]
}

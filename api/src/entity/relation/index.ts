/* USERS-POSTS */

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

/* CATEGORIES-POSTS */

export function getCategoriesPostsKey(categoryId: string, postId?: string) {
  if (postId === undefined) {
    return `CATEGORIES-POSTS-categoryId#${categoryId}`
  }

  return `CATEGORIES-POSTS-categoryId#${categoryId}-postId#${postId}`
}

const categoriesPostsRegExp = new RegExp(
  /CATEGORIES-POSTS-categoryId#\w+-postId#(.*)/,
)
export function getPostIdFromCategoriesPostsKey(key: string) {
  const matches = categoriesPostsRegExp.exec(key)
  if (matches === null) {
    return null
  }
  return matches[1]
}

/* CATEGORIES-RDTSS-POSTS */

export function getCategoriesRevDateTimeStrPostsKey(
  categoryId?: string,
  revDateTimeStr?: string,
  postId?: string,
) {
  if (categoryId === undefined) {
    return `CATEGORIES-RDTSS-POSTS`
  }
  if (revDateTimeStr === undefined) {
    return `CATEGORIES-RDTSS-POSTS-categoryId#${categoryId}`
  }
  if (postId === undefined) {
    return `CATEGORIES-RDTSS-POSTS-categoryId#${categoryId}-revDateTimeStr#${revDateTimeStr}`
  }

  return `CATEGORIES-RDTSS-POSTS-categoryId#${categoryId}-revDateTimeStr#${revDateTimeStr}-postId#${postId}`
}

const categoriesRevDateTimeStrsPostsRegExp = new RegExp(
  /CATEGORIES-RDTSS-POSTS-categoryId#\w+-revDateTimeStr#(.*)-postId#(.*)/,
)
export function getElementsFromCategoriesRevDateTimeStrsPostsKey(key: string) {
  const matches = categoriesRevDateTimeStrsPostsRegExp.exec(key)
  if (matches === null) {
    return null
  }
  return matches
}
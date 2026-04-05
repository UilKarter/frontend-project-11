import { proxy } from 'valtio/vanilla'

export default proxy({
  process: {
    phase: 'filling',
    errorCode: null,
  },
  feeds: [],
  posts: [],
  ui: {
    viewedPostIds: [],
    modalPostId: null,
  },
})

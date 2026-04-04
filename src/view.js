import { subscribe } from 'valtio/vanilla'

const renderFeeds = (feeds) => {
  const container = document.querySelector('.feeds-container')
  if (!container) return

  if (feeds.length === 0) {
    container.innerHTML = ''
    return
  }

  const feedsHtml = `
    <div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">Фиды</h2>
        <ul class="list-group border-0">
          ${feeds.map(feed => `
            <li class="list-group-item">
              <h3 class="h6">${escapeHtml(feed.title)}</h3>
              <p class="small text-muted">${escapeHtml(feed.description)}</p>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `
  container.innerHTML = feedsHtml
}

const renderPosts = (posts) => {
  const container = document.querySelector('.posts-container')
  if (!container) return

  if (posts.length === 0) {
    container.innerHTML = ''
    return
  }

  const postsHtml = `
    <div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">Посты</h2>
        <ul class="list-group border-0">
          ${posts.map(post => `
            <li class="list-group-item d-flex justify-content-between align-items-start">
              <a href="${escapeHtml(post.link)}" target="_blank" class="fw-bold">${escapeHtml(post.title)}</a>
              <button class="btn btn-sm btn-outline-primary" data-post-id="${post.id}">Просмотр</button>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `
  container.innerHTML = postsHtml

  document.querySelectorAll('[data-post-id]').forEach((btn) => {
    const handleClick = () => {
      const postId = btn.dataset.postId
      const post = posts.find(p => p.id === postId)
      if (post) {
        alert(`Пост: ${post.title}\n\n${post.description}`)
      }
    }
    btn.addEventListener('click', handleClick)
  })
}
const escapeHtml = (str) => {
  if (!str) return ''
  return str.replace(/[&<>]/g, (match) => {
    if (match === '&') return '&amp;'
    if (match === '<') return '&lt;'
    if (match === '>') return '&gt;'
    return match
  })
}

export default (state, elements, i18n) => {
  const { input, submitButton, feedback } = elements

  const refreshUi = () => {
    const { phase, errorCode } = state.process

    input.classList.remove('is-invalid', 'is-valid')
    feedback.textContent = ''
    feedback.classList.remove('text-danger', 'text-success')

    if (phase === 'error') {
      input.classList.add('is-invalid')
      feedback.textContent = i18n.t(errorCode ?? 'errors.unknown')
      feedback.classList.add('text-danger')
    }

    if (phase === 'done') {
      input.classList.add('is-valid')
      feedback.textContent = i18n.t('form.success')
      feedback.classList.add('text-success')

      setTimeout(() => {
        if (state.process.phase === 'done') {
          input.value = ''
          input.classList.remove('is-valid')
          feedback.textContent = ''
        }
      }, 2000)
    }

    const isLoading = phase === 'loading'
    input.disabled = isLoading
    submitButton.disabled = isLoading
    renderFeeds(state.feeds)
    renderPosts(state.posts)
  }

  refreshUi()
  subscribe(state, refreshUi)
}

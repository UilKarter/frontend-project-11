let counter = 0

const getId = () => {
  counter += 1
  return `id-${Date.now()}-${counter}`
}

export default getId

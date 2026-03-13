function routeAgents(message) {

  const text = message.toLowerCase()

  if (text.includes("proposta")) {
    return ["copywriter", "design", "sales"]
  }

  if (text.includes("anuncio") || text.includes("ads")) {
    return ["marketing", "copywriter"]
  }

  if (text.includes("design")) {
    return ["design"]
  }

  if (text.includes("campanha")) {
    return ["marketing", "analytics"]
  }

  return ["generalist"]

}

module.exports = routeAgents



const loadAgent = require("./agentLoader")

async function runAgents(message, agents) {

  const responses = []

  for (const agent of agents) {

    const prompt = loadAgent(agent)

    if (!prompt) continue

    responses.push(`
AGENTE: ${agent}

${prompt}

TAREFA:
${message}
`)

  }

  return responses.join("\n\n")

}

module.exports = runAgents

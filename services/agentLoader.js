const fs = require("fs")
const path = require("path")

function loadAgent(agentName) {

  const agentsDir = path.join(__dirname, "..", "agents")

  const folders = fs.readdirSync(agentsDir)

  for (const folder of folders) {

    const folderPath = path.join(agentsDir, folder)

    const files = fs.readdirSync(folderPath)

    for (const file of files) {

      if (file.includes(agentName)) {

        return fs.readFileSync(
          path.join(folderPath, file),
          "utf8"
        )

      }

    }

  }

  return null

}

module.exports = loadAgent

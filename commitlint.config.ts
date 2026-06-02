import type { UserConfig } from "@commitlint/types"

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [0],        // pas de contrainte de casse sur le sujet
    "body-max-line-length": [0], // pas de limite sur le corps
  },
}

export default config

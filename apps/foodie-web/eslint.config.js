// NOT eslint-config-next: that + FlatCompat currently crashes under Next 16
// with "Converting circular structure to JSON" inside @eslint/eslintrc's
// config validator (a Next 16 + flat-config compat bug, not our code — see
// TODO.md). Using the shared monorepo preset until that's sorted out means
// this app loses Next-specific rules (no-img-element, etc.) for now.
module.exports = require("../../packages/config/eslint-preset.js");

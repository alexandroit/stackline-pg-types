# Migration

## Existing `pg-types` Consumers

Use an npm alias to retain every existing import:

```bash
npm install pg-types@npm:@stackline/pg-types
```

No source change is required:

```js
var types = require('pg-types')
```

In `package.json` the dependency is represented as:

```json
{
  "dependencies": {
    "pg-types": "npm:@stackline/pg-types@1.0.0"
  }
}
```

## Scoped Consumers

New code can install and import the scoped package directly:

```bash
npm install @stackline/pg-types
```

```js
var types = require('@stackline/pg-types')
```

## node-postgres Integration

Most applications access these parsers through `pg.types`. Use
`@stackline/pg` when the complete node-postgres integration is required; it
pins this maintained parser leaf internally.

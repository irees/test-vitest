# Vitest failure investigation

Reproduce a very strange `Session is not connected` error while running tests with coverage on Nuxt v4.2.0 and Vitest v4.0.8.

TLDR: 

My `tlv2-ui` nuxt module, that lives in another repo, uses `addVitePlugin` in its Nuxt module init to extend vite's `optimizeDeps`, the error occurs. 

The error goes away when `optimizeDeps` is not extended. You can verify this by modifying `node_modules/tlv2-ui/dist/module.mjs` in-place.

Downgrading to Vitest v3 seems to work, so I am just going to do that for now.

# Details

## "vue" test config

Using @vue/test-util & happy-dom works.

```
irees@studio (db:localhost/tlv2) (k8:mtc) test-vitest % yarn test --project vue --coverage

 RUN  v4.0.8 /Users/irees/src/other/test-vitest/test-vitest
      Coverage enabled with v8

 ✓  vue  test/vue/component.test.ts (1 test) 8ms
   ✓ ok component 7ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  01:44:20
   Duration  218ms (transform 24ms, setup 0ms, collect 72ms, tests 8ms, environment 70ms, prepare 8ms)

 % Coverage report from v8
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |                   
 ok.vue   |     100 |      100 |     100 |     100 |                   
----------|---------|----------|---------|---------|-------------------
```

## "e2e" test config

With `await setup()` in test init script works fine:

```
irees@studio (db:localhost/tlv2) (k8:mtc) test-vitest % yarn test --project e2e --coverage

 RUN  v4.0.8 /Users/irees/src/other/test-vitest/test-vitest
      Coverage enabled with v8

(node:74530) [DEP0155] DeprecationWarning: Use of deprecated trailing slash pattern mapping "./" in the "exports" field module resolution of the package at /Users/irees/src/other/test-vitest/test-vitest/node_modules/tslib/package.json imported from /Users/irees/src/other/test-vitest/test-vitest/.nuxt/test/7dm52n/dist/server/server.mjs. Mapping specifiers ending in "/" is no longer supported.
(Use `node --trace-deprecation ...` to show where the warning was created)
Listening on http://127.0.0.1:64457
 ✓  e2e  test/e2e/api.test.ts (1 test) 10547ms
   ✓ API E2E (1)
     ✓ should return success for /api/ok 32ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  00:53:23
   Duration  10.87s (transform 12ms, setup 65ms, collect 4ms, tests 10.55s, environment 0ms, prepare 7ms)

 % Coverage report from v8
----------------|---------|----------|---------|---------|-------------------
File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------------|---------|----------|---------|---------|-------------------
All files       |       0 |        0 |       0 |       0 |                   
 nuxt.config.ts |       0 |        0 |       0 |       0 |                   
----------------|---------|----------|---------|---------|-------------------
```

## "nuxt" test config

Using `await defineVitestProject` (from docs) works without coverage:

```
irees@studio (db:localhost/tlv2) (k8:mtc) test-vitest % yarn test --project nuxt           

 RUN  v4.0.8 /Users/irees/src/other/test-vitest/test-vitest

The Vitest environment nuxt defines the "transformMode". This options was deprecated in Vitest 4 and will be removed in the next major version. Please, use "viteEnvironment" instead.
stdout | test/nuxt/component.test.ts
<Suspense> is an experimental feature and its API will likely change.

 ✓  nuxt  test/nuxt/component.test.ts (1 test) 5ms
   ✓ ok component 5ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  00:54:57
   Duration  1.90s (transform 1.32s, setup 1.43s, collect 102ms, tests 5ms, environment 307ms, prepare 2ms)
```

... but fails when `--coverage` is specified:

```
irees@studio (db:localhost/tlv2) (k8:mtc) test-vitest % yarn test --project nuxt --coverage

 RUN  v4.0.8 /Users/irees/src/other/test-vitest/test-vitest
      Coverage enabled with v8

The Vitest environment nuxt defines the "transformMode". This options was deprecated in Vitest 4 and will be removed in the next major version. Please, use "viteEnvironment" instead.
stdout | test/nuxt/component.test.ts
<Suspense> is an experimental feature and its API will likely change.

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Unhandled Errors ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

Vitest caught 1 unhandled error during the test run.
This might cause false positive tests. Resolve unhandled errors to make sure your tests are not affected.

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Test Run Error ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Error: Session is not connected
 ❯ Session.post node:inspector:126:13
 ❯ node:internal/util:441:7
 ❯ Session.post node:internal/util:427:12
 ❯ Object.takeCoverage node_modules/@vitest/coverage-v8/dist/index.js:26:34
 ❯ takeCoverageInsideWorker node_modules/vitest/dist/chunks/setup-common.LGjNSzXp.js:13:58
 ❯ processTicksAndRejections node:internal/process/task_queues:95:5
 ❯ VitestTestRunner.testRunner.onAfterRunFiles node_modules/vitest/dist/chunks/index.BY4-tcno.js:75:20
 ❯ startTests node_modules/@vitest/runner/dist/index.js:1560:3
 ❯ run node_modules/vitest/dist/chunks/base.BgTO2qAg.js:85:25

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { code: 'ERR_INSPECTOR_NOT_CONNECTED' }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯


 Test Files   (1)
      Tests   (1)
     Errors  1 error
   Start at  00:55:22
   Duration  1.93s (transform 1.33s, setup 1.44s, collect 102ms, tests 0ms, environment 307ms, prepare 25ms)

 % Coverage report from v8
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |       0 |        0 |       0 |       0 |                   
----------|---------|----------|---------|---------|-------------------
```

## Debugging and root cause (??)

After substantial debugging, including creating this new project test case project, and stepping through all possible combinations, the culprit appears to be the inclusion of my `tlv2-ui` nuxt module, which is where I keep components and configurations common across all of my nuxt projects. Note: both the module and this repository are using current versions of nuxt (4.2.0) and all other dependencies because the goal of the project (where I encountered this failure) was upgrading from nuxt v3 to nuxt v4.

Specifically, the failure occurs when the tlv2-ui module adds items to vite's `optimizeDeps` through its own vite plugin. If I remove the `optimizeDeps` config, then test with coverage works. If any of the items are included (it doesn't matter which one), then it fails with the above `Session is not connected error`

https://github.com/interline-io/tlv2-ui/blob/main/src/module.ts

```
export default defineNuxtModule<ModuleOptions>({
    ...
  async setup (options, nuxt) {
    ...
    // Add Vite plugin - Nuxt 4 pattern
    addVitePlugin(() => ({
      name: 'tlv2-ui:vite-config',
      configEnvironment (name, config) {
        // Vite optimizeDeps pre-bundles dependencies for faster dev server
        // Include packages that:
        // - Have many internal modules (reduces waterfall requests)
        // - Are CommonJS and need ESM conversion for browser
        // - Cause slow cold starts or discovery issues
        config.optimizeDeps = config.optimizeDeps || {}
        config.optimizeDeps.include = config.optimizeDeps.include || []
        config.optimizeDeps.include.push(
          '@mapbox/mapbox-gl-draw', // Large library with 100+ modules
          '@observablehq/plot', // Complex plotting library with many internal imports
          'binary-search-bounds', // CommonJS dependency of interval-tree-1d - needs ESM conversion
          'cytoscape-fcose', // Graph layout algorithm - needs ESM conversion
          'cytoscape', // Core graph library - needs ESM conversion
          'fast-json-stable-stringify', // Small utility but frequently imported - bundle once
          'maplibre-gl', // Large mapping library - dramatically speeds up dev cold starts
          'mixpanel-browser', // Analytics SDK with dynamic imports
          'zen-observable' // Observable polyfill used by Apollo
        )
      },
      config (config) {
        // Fix for local development with symlinks (yarn/npm link, --stub mode)
        // https://github.com/nuxt/nuxt/issues/20001
        // Without this, Vite fails to resolve module files when using symlinked dependencies
        config.resolve = config.resolve || {}
        config.resolve.preserveSymlinks = true
      }
    }))
  }
})
```
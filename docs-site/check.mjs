import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

var siteDir = path.dirname(fileURLToPath(import.meta.url))
var projectDir = path.resolve(siteDir, '..')

function read (base, name) {
  var file = path.join(base, name)
  if (!fs.existsSync(file)) throw new Error('Missing documentation file: ' + file)
  var value = fs.readFileSync(file, 'utf8')
  if (!value.trim()) throw new Error('Empty documentation file: ' + file)
  return value
}

function assert (condition, message) {
  if (!condition) throw new Error(message)
}

function includesAll (value, needles, label) {
  needles.forEach(function (needle) {
    assert(value.indexOf(needle) !== -1, label + ' is missing: ' + needle)
  })
}

var siteFiles = [
  'index.html',
  'styles.css',
  'app.js',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'llms-full.txt',
  'package-meta.json'
]

var rootFiles = [
  'README.md',
  'CHANGELOG.md',
  'COMPATIBILITY.md',
  'MIGRATION.md',
  'DEPENDENCY_REVIEW.md',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'PUBLISHING.md',
  'NOTICE',
  'THIRD_PARTY_LICENSES.md'
]

var site = {}
siteFiles.forEach(function (name) { site[name] = read(siteDir, name) })

var docs = {}
rootFiles.forEach(function (name) { docs[name] = read(projectDir, name) })

var html = site['index.html']
var visibleHtml = html.replace(/<!--\/?email_off-->/g, '')
var css = site['styles.css']
var app = site['app.js']
var robots = site['robots.txt']
var sitemap = site['sitemap.xml']
var llms = site['llms.txt']
var llmsFull = site['llms-full.txt']
var packageMetadata = JSON.parse(site['package-meta.json'])
var canonical = 'https://alexandro.net/docs/vanilla/pg-types/'

assert(packageMetadata.name === '@stackline/pg-types', 'package metadata identity is wrong')
assert(packageMetadata.version === '1.0.0', 'package metadata version is wrong')
assert(packageMetadata.runtimeFloor === 'Node.js 4', 'package metadata runtime floor is wrong')
assert(packageMetadata.moduleFormat === 'CommonJS and ESM', 'package metadata module format is wrong')
assert(packageMetadata.productionDependencies === 0, 'package metadata dependency count is wrong')

includesAll(visibleHtml, [
  '<html lang="en">',
  '<link rel="canonical" href="' + canonical + '">',
  'Alexandro.Net',
  'Open Source',
  'href="#content"',
  '<main id="content" tabindex="-1">',
  '<nav class="top-nav" aria-label="Page navigation">',
  '<footer class="site-footer">',
  'aria-live="polite"',
  'role="img"',
  '<caption>',
  'npm install @stackline/pg-types@1.0.0',
  'npm install pg-types@npm:@stackline/pg-types@1.0.0',
  'Node.js ≥4',
  'TypeScript 3.9+',
  'Zero runtime dependencies',
  'xtend@4.0.2',
  'not affiliated with or endorsed by'
], 'index.html')

;['getTypeParser(', 'setTypeParser(', 'arrayParser.create(', 'builtins', 'TypeId'].forEach(function (api) {
  assert(visibleHtml.indexOf(api) !== -1, 'index.html is missing API: ' + api)
  assert(docs['README.md'].indexOf(api) !== -1, 'README.md is missing API: ' + api)
})

assert((html.match(/<h1(?:\s|>)/g) || []).length === 1, 'index.html must contain exactly one h1')
assert(html.length > 14000, 'index.html is unexpectedly thin')
assert(html.indexOf('http://') === -1, 'index.html contains an insecure URL')
assert(html.indexOf('localhost') === -1, 'index.html contains localhost')
assert((html.match(/<!--email_off-->/g) || []).length === 2, 'index.html must protect two package-at-version strings')
assert((html.match(/<!--\/email_off-->/g) || []).length === 2, 'email protection markers must balance')

var jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
assert(jsonLdMatch, 'index.html is missing JSON-LD')
var jsonLd = JSON.parse(jsonLdMatch[1])
assert(jsonLd['@type'] === 'SoftwareSourceCode', 'JSON-LD type is wrong')
assert(jsonLd.name === '@stackline/pg-types', 'JSON-LD package identity is wrong')
assert(jsonLd.version === '1.0.0', 'JSON-LD package version is wrong')
assert(jsonLd.url === canonical, 'JSON-LD canonical URL is wrong')

includesAll(css, [
  ':focus-visible',
  'overflow-wrap: anywhere',
  'max-width: 100%',
  'min-width: 0',
  '@media (max-width:',
  '@media (prefers-reduced-motion: reduce)',
  '@media print'
], 'styles.css')

includesAll(app, ["'use strict'", '[data-copy-target]', 'navigator.clipboard.writeText'], 'app.js')
assert(robots.indexOf('Allow: /docs/vanilla/pg-types/') !== -1, 'robots.txt has the wrong allow path')
assert(robots.indexOf('Sitemap: ' + canonical + 'sitemap.xml') !== -1, 'robots.txt has the wrong sitemap')
assert(sitemap.indexOf('<loc>' + canonical + '</loc>') !== -1, 'sitemap lacks the canonical route')

var locations = []
var locationPattern = /<loc>([^<]+)<\/loc>/g
var locationMatch
while ((locationMatch = locationPattern.exec(sitemap))) locations.push(locationMatch[1])
assert(locations.length === 14, 'sitemap must contain exactly 14 canonical URLs')
locations.forEach(function (location) {
  var parsed = new URL(location)
  assert(parsed.protocol === 'https:', 'Sitemap URL must use https: ' + location)
  assert(parsed.hostname === 'alexandro.net', 'Sitemap URL must use alexandro.net: ' + location)
  assert(parsed.pathname.indexOf('/docs/vanilla/pg-types/') === 0, 'Sitemap URL has the wrong path: ' + location)
})

;[llms, llmsFull].forEach(function (value, index) {
  includesAll(value, [
    '@stackline/pg-types@1.0.0',
    'pg-types@2.2.0',
    'npm install pg-types@npm:@stackline/pg-types@1.0.0',
    'Node.js 4',
    canonical,
    'zero runtime dependencies',
    'xtend@4.0.2'
  ], index === 0 ? 'llms.txt' : 'llms-full.txt')
})

includesAll(docs['COMPATIBILITY.md'], [
  'getTypeParser',
  'setTypeParser',
  'arrayParser',
  'TypeId',
  'Node.js 4 or newer',
  '__proto__'
], 'COMPATIBILITY.md')

includesAll(docs['DEPENDENCY_REVIEW.md'], [
  'zero runtime dependencies',
  'pg-int8@1.0.1',
  'postgres-array@2.0.0',
  'postgres-bytea@1.0.1',
  'postgres-date@1.0.7',
  'postgres-interval@1.2.0',
  'xtend@4.0.2'
], 'DEPENDENCY_REVIEW.md')

rootFiles.forEach(function (name) {
  assert(!/PLACEHOLDER|TBD/.test(docs[name]), name + ' contains unfinished placeholder text')
})

console.log('pg-types documentation checks passed: ' + (siteFiles.length + rootFiles.length) + ' files')

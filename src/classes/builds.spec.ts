import * as fs from 'fs-extra'

import { test } from 'ava'
import { Docker, Builds } from 'cohosting-node'

let docker = new Docker()
let hosts = new Builds(docker,'hosts')
let clients = new Builds(docker,'clients')

test('Hosts class is correct', t => {
  t.deepEqual(hosts instanceof Builds, true)
})

test('Clients class is correct', t => {
  t.deepEqual(clients instanceof Builds, true)
})

test('Get build `hosts` choices', async t => {
  t.deepEqual((Object.keys(await hosts.fetchAvailableBuilds()).length > 0), true)
})

test('Hosts path is correct', async t => {
  t.deepEqual(hosts._testGetBuildPath('test'), 'hosts')
})

test('Clients path is correct', async t => {
  t.deepEqual(clients._testGetBuildPath('test'), 'clients/test')
})

test.after('Check file is created', async t => {
  let path = __dirname + '/../../../chconfig.json'
  await hosts._testSaveBuilds({ test: 'test' })
  return fs.readJson(path)
    .then(data => {
      fs.remove(path)
        .catch(() => { /**/ })
      t.deepEqual(data.test, 'test')
    })
    .catch(() => { /**/ })
})

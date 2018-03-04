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

// test('Hosts path is correct', async t => {
//   t.deepEqual(hosts.getBuildPath('test'), 'hosts')
// })
//
// test('Hosts path is correct', async t => {
//   t.deepEqual(clients.getBuildPath('test'), 'clients/test')
// })

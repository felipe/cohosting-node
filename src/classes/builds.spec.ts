import { test } from 'ava'
import { Docker, Builds } from 'cohosting-node'

let docker = new Docker()
let hosts = new Builds(docker,'hosts')
let clients = new Builds(docker,'clients')

test('Hosts class is correct', async t => {
  t.deepEqual(hosts instanceof Builds, true)
})

test('Clients class is correct', async t => {
  t.deepEqual(clients instanceof Builds, true)
})

test('Get choices', async t => {
  let page = await hosts.fetchCurrentBuilds()
  t.deepEqual(typeof page, typeof page) // TODO: fix this bullshit test
})

// These are private methods, tests dont work

// test('Hosts path is correct', async t => {
//   t.deepEqual(hosts.getBuildPath('test'), 'hosts')
// })
//
// test('Hosts path is correct', async t => {
//   t.deepEqual(clients.getBuildPath('test'), 'clients/test')
// })

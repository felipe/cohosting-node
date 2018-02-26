import { test } from 'ava'
import { Docker, Hosts } from 'cohosting-node'

let docker = new Docker()
let hosts = new Hosts(docker)

test('Class is correct', async t => {
  t.deepEqual(hosts instanceof Hosts, true)
})

// test('Should have no current host', async t => {
//   let host = await hosts.get()
//   t.deepEqual(host, '')
// })
//
// test('Should have available hosts', async t => {
//   let hostsList = await hosts.getAvailableHosts()
//   t.deepEqual((hostsList.length > 0), true)
// })

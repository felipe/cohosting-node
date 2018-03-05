import { test } from 'ava'
import { Docker, Hosts } from 'cohosting-node'

let docker = new Docker()
let hosts = new Hosts(docker)

test('Class is correct', t => {
  t.deepEqual(hosts instanceof Hosts, true)
})

test('Should have no current host', async t => {
  let host = await hosts.get()
  t.deepEqual(host, '')
})

test('Should have available hosts', async t => {
  hosts.current = ''
  let hostsList = await hosts.getAvailableHosts()
  t.deepEqual((hostsList.length > 0), true)
})

// test('Should create a host', async t => {
//   let hostsList = await hosts.getAvailableHosts()
//   if ((hostsList.length > 0)) {
//     await hosts.makeSet(hostsList[0])
//     t.deepEqual(await hosts.get(), hostsList[0])
//   } else {
//     t.fail()
//   }
// })

test('Should print available hosts', async t => {
  hosts.availableHosts = []
  await hosts.printAvailableHosts()
  t.deepEqual((hosts.availableHosts.length > 0), true)
})

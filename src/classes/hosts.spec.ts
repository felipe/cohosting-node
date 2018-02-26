import { test } from 'ava'
import { Docker, Hosts } from 'cohosting-node'

let docker = new Docker()
let hosts = new Hosts(docker)

test('Class is correct', async t => {
  t.deepEqual(hosts instanceof Hosts, true)
})

import * as Table from 'easy-table'

export * from './classes/builds'
export * from './classes/clients'
export * from './classes/docker'
export * from './classes/hosts'

export * from './objects/choice'
export * from './objects/container'

export * from './lib/selector'

import { Docker, Hosts, Clients, Selector, Choice, Container } from '.'

let docker = new Docker()
let hosts = new Hosts(docker)
let clients = new Clients(docker)

// Entrypoint
let entryPoint = () => {
  let action = Selector.builder('Ready to help!',[
                              new Choice('Start','start'),
                              new Choice('Add','add'),
                              new Choice('Status','list'),
                              new Choice('Remove','remove'),
                              new Choice('Stop','stop')
                           ])

  switch(action){
    case 'start':
      hosts.set()
        .then(()=>{ entryPoint() })
      break
    case 'add':
      clients.set()
        .then(()=>{ entryPoint() })
      break
    case 'list':
      docker.printContainers()
        .then(()=>{ entryPoint() })
      break
    case 'remove':
      docker.selectDockerGroupings()
        .then(()=>{ entryPoint() })
      break
    case 'stop':
      docker.stopServer()
        .then(response => { if (!response) { entryPoint() } })
      break
    default:
      console.log('Pretty sure this was supposed to do something exciting.')
      break
  }
}

entryPoint()

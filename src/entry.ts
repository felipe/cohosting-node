import * as Table from 'easy-table'

import { Docker } from './classes/docker'
import { Hosts } from './classes/hosts'
import { Clients } from './classes/clients'

import { Selector } from './lib/selector'

import { Choice } from './objects/choice'
import { Container } from './objects/container'

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

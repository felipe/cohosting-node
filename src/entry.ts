import * as Docker from 'dockerode'
import * as Table from 'easy-table'
import { Choice } from './objects/choice'
import { Container } from './objects/container'
import * as Selector from './lib/selector'

// Entrypoint
let entryPoint = () => {
  let action = Selector.builder('Ready to help!',[
                              new Choice('Start','start'),
                              new Choice('Add','add'),
                              new Choice('Status','list'),
                              new Choice('Remove','remove'),
                              new Choice('Stop','stop')
                           ])

  let docker = new Docker();

  switch(action){
    case 'start':
      break
    case 'add':
      entryPoint()
      break
    case 'list':
      let table = Array<Container>()
      docker.listContainers((err, containers) => {
        if(containers.length > 0) {
          containers.forEach((containerInfo) => {
            table.push(new Container(containerInfo.Names[0], containerInfo.Image, containerInfo.State, containerInfo.Status))
          })
          console.log(Table.print(table))
        } else {
          console.log('\nThere are currently no active containers.')
        }
        entryPoint()
      })
      break
    case 'remove':
      let choices = Array<Choice>()
      docker.listContainers((err, containers) => {
        if(containers.length > 0) {
          containers.forEach((containerInfo) => {
            var container = new Container(containerInfo.Names[0], containerInfo.Image, containerInfo.State, containerInfo.Status)
            choices.push(new Choice(container.name, containerInfo.Id))
          })
          var remove = Selector.builder('Remove which container?',choices)
          console.log("removing: "+remove)
          var container = docker.getContainer(remove);
          container.remove((err, data) => {
            console.log(data);
          });
        } else {
          console.log('\nThere are currently no active containers.')
        }
        entryPoint()
      })
      break
    case 'stop':
      docker.listContainers((err, containers) => {
        containers.forEach((containerInfo) => {
          docker.getContainer(containerInfo.Id).stop();
        })
      })
      break
    default:
      console.log('Pretty sure this was supposed to do something exciting.')
      break
  }
}

entryPoint()

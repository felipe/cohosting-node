import * as Table from 'easy-table'
import * as Dockerode from 'dockerode'

import { Selector } from '../lib/selector'

import { Choice } from '../objects/choice'

import { Container } from '../objects/container'

export class Docker {
  private docker = new Dockerode()
  private containers: Array<Container> = []
  private containerChoices: Array<Choice> = []
  private groupingChoices: Array<Choice> = []
  private groupValues = {}

  public getContainers () {
    return this.updateContainers()
  }

  public async printContainers () {
    let containers = await this.updateContainers()
    if (containers && containers.length > 0) {
      console.log('\n' + Table.print(containers))
    } else {
      console.log('\nNo active containers.')
    }
  }

  public async selectDockerGroupings () {
    let containers = await this.updateContainers()

    // Exit early if no containers are active
    if (!containers || containers.length === 0) {
      console.log('\nNo active containers.')
      return false
    }

    let method = Selector.builder('How are we removing containers?',[ new Choice('Individually','one'), new Choice('Grouped','many') ])

    let removalText = 'Which container ' + (method === 'one' ? '' : 'group ') + 'should we remove?'
    let remove = Selector.builder(removalText, (method === 'one' ? this.containerChoices : this.groupingChoices))
    switch (method) {
      case 'one':
        console.log('Single: ', remove)
        break
      case 'many':
        console.log('Group `' + remove + '`: ', this.groupValues[remove])
        break
    }
  }

  public async stopServer () {
    let containers = await this.updateContainers()

    // Exit early if no containers are active
    if (!containers || containers.length === 0) {
      console.log('\nNo active containers.')
      return false
    }

    if (Selector.YNQuestion('Stop all running containers?')) {
      this.stopContainers()
      return true
    } else {
      this.stopContainer('0')
      return false
    }
  }

  private updateContainers () {
    this.containers = []
    this.containerChoices = []
    this.groupingChoices = []
    return new Promise(resolve => {
      return this.docker.listContainers((err, containers) => {
        if (err) {
          throw err
        }
        if (containers.length > 0) {
          containers.forEach((containerInfo) => {
            this.addContainer(new Container(containerInfo.Names[0], containerInfo.Image, containerInfo.State, containerInfo.Status))
            let containerName = containerInfo.Names[0].replace('/','')
            let groupName = containerName.split('_')[0]
            this.addGroupValues(groupName, containerInfo.Id)
            this.addContainerChoice(new Choice(containerName, containerInfo.Id))
          })
        }
        resolve(true)
      })
    })
    .then(() => { return this.containers })
    .catch(err => { console.error('Code Error :: ', err) })
  }

  private addContainer (container: Container) {
    this.containers.push(container)
  }

  private addGroupValues (group: string, id: string) {
    if (typeof this.groupValues[group] === 'undefined') {
      this.addGroupingChoice(new Choice(group, group))
      this.groupValues[group] = []
    }
    this.groupValues[group].push(id)
  }

  private addGroupingChoice (choice: Choice) {
    this.groupingChoices.push(choice)
  }

  private addContainerChoice (choice: Choice) {
    this.containerChoices.push(choice)
  }

  private stopContainers () {
    this.docker.listContainers((err, containers) => {
      if (err) { console.error(err) }
      containers.forEach((containerInfo) => {
        this.docker.getContainer(containerInfo.Id).stop()
      })
    })
  }

  private stopContainer (containerId: string) {
    this.docker.getContainer(containerId).stop()
  }

}

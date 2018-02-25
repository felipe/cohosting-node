import * as Table from 'easy-table'
import * as Dockerode from 'dockerode'

import { Container } from '../objects/container'

export class Docker {
  private docker = new Dockerode ()
  private containers: Array<Container> = []

  public async getContainers () {
    let containers = await this.updateContainers()
    return containers
  }

  public async printContainers () {
    let containers = await this.updateContainers()
    if (containers.length > 0) {
      console.log('\n' + Table.print(containers))
    } else {
      console.log('\nNo active containers.')
    }
  }

  private updateContainers () {
    this.containers = [] // Reset containers
    return new Promise(resolve => {
      this.docker.listContainers((err, containers) => {
        if (err) {
          throw err
        }
        if (containers.length > 0) {
          containers.forEach((containerInfo) => {
            this.addContainer(new Container(containerInfo.Names[0], containerInfo.Image, containerInfo.State, containerInfo.Status))
          })
        }
        resolve(true)
      })
      .catch(err => {
        console.log(err)
      })
    }).then(() => { return this.containers })
  }

  private addContainer (container: Container) {
    this.containers.push(container)
  }
}

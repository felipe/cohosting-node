import { Selector } from '../lib/selector'

import { Builds } from '../classes/builds'
import { Docker } from '../classes/docker'

export class Clients extends Builds {

  current: String = ''
  availableClients: Array<string> = []

  constructor (docker: Docker) {
    super(docker, 'clients')
  }

  public async set () {
    await this.init()
    if (this.current === '') {
      let client = Selector.builder('Pick a client',super.getAvailableChoices(this.availableClients))
      let name = Selector.inline('What name should it use? (ex: domain.com)').replace('.','').replace(' ','').toLowerCase()
      await super.prepareBuild(client, name)
      await super.defineEnvironment(name)
      await super.performBuild(client, name)
    }
  }

  public async get () {
    await this.init()
    return this.current
  }

  /**
   * Returns an array of all the available hosts
   */
  public async getAvailableHosts () {
    await this.init()
    return this.availableClients
  }

  public async printAvailableHosts () {
    await this.init()
    console.log('\n', this.availableClients)
  }

  private async init () {
    if (this.availableClients.length === 0) {
      this.availableClients = await super.fetchAvailableBuilds()
    }
    if (this.current === '') {
      // Read a json file
      // this.current = await super.fetchCurrentBuild()
    }
  }
}

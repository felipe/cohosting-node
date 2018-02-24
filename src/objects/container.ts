export class Container {
  public name: string
  public image: string
  public state: string
  public uptime: string

  public constructor (name: string, image: string, state: string, uptime: string) {
    this.name = name.replace('/','')
    this.image = image
    this.state = state
    this.uptime = uptime
  }
}

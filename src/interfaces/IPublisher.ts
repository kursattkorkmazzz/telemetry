export default interface IPublisher {
  name: string
  publish(data: any, ...args: any): Promise<void>;
}

export default abstract class AbstractPublisher {
  abstract publish(...args: any): Promise<void>;
}

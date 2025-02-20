export default abstract class AbstractPublisher {
    abstract name: string;
    abstract publish(...args: any): Promise<void>;
}

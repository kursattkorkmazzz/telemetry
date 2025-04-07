export default function mergeRefs<T>(
  ...refs: (React.Ref<T> | null | undefined)[]
) {
  return (instance: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref && typeof ref === "object") {
        (ref as React.RefObject<T | null>).current = instance;
      }
    });
  };
}

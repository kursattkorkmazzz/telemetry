export default function PrintError(e: any) {
  console.log(e instanceof Error ? e.message : e);
}

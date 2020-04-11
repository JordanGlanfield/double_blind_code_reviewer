
export async function sleep(timeMillis: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, timeMillis));
}
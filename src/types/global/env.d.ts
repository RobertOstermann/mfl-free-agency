declare module "@/vite-env" {
  interface ENV {
    temp: string;
  }

  const env: ENV;
  export default env;
}

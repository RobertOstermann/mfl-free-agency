export class Api {
  private static getApiRoute = () => {
    let api = "https://localhost:5001/api/v1";
    if (process.env.NODE_ENV === "production") {
      api = `${window.location.origin}/api/v1`;
    }

    return api;
  };

  public static route = this.getApiRoute();
}

import { Issue } from "./issue";
import fetch from "node-fetch";

export class Client {
  public baseUrl: string;
  private encodedApiToken: string;

  public constructor(apiToken: string, domainName: string) {
    this.baseUrl = `https://${domainName}/res/api/3`;
    this.encodedApiToken = Buffer.from(apiToken).toString("base64");
  }

  public async getIssue(key: string): Promise<Issue> {
    const response = await fetch(`${this.baseUrl}/issue/${key}?fields=summary`, {
      headers: {
        Authorization: `Basic ${this.encodedApiToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Unexpected response returned: ${response.body}`);
    }

    return (await response.json()) as Issue;
  }
}

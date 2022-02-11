import { Issue } from "./issue";
import fetch from "node-fetch";

export class Client {
  public browseBaseUrl = "https://maxkelsen.atlassian.net/browse/POP-169";
  private apiBaseUrl: string;
  private encodedApiToken: string;

  public constructor(apiToken: string, domainName: string) {
    this.browseBaseUrl = `https://${domainName}/browse`;
    this.apiBaseUrl = `https://${domainName}/rest/api/3`;
    this.encodedApiToken = Buffer.from(apiToken).toString("base64");
  }

  public async getIssue(key: string): Promise<Issue> {
    const response = await fetch(`${this.apiBaseUrl}/issue/${key}?fields=summary`, {
      headers: {
        Authorization: `Basic ${this.encodedApiToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    return (await response.json()) as Issue;
  }
}

export enum Key {
  JIRA_ISSUE = "Jira Issue",
}

export class Tag {
  public key: string;
  public value: string;

  public constructor(key: string, value = "") {
    this.key = key;
    this.value = value;
  }
}

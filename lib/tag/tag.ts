export enum Key {
  JIRA_ISSUE = "Jira Issue",
}

export class Tag {
  public key: string;
  public value: string;

  constructor(key: string, value: string = "") {
    this.key = key;
    this.value = value;
  }
}

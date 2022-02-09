import * as core from "@actions/core";
import * as action from "./lib/action";
import { Client } from "./lib/jira";
import { Key, read, write } from "./lib/tag";

async function run(): Promise<void> {
  const client = new action.Client(core.getInput("github-token"));

  if (!client.isPullRequest()) {
    console.error("This action can only be run on pull requests.");
    return;
  }

  const pullRequest = await client.getPullRequest();

  const tags = read(pullRequest.body);
  if (tags.length === 0) {
    console.log("No tags found in this pull request body.");
    return;
  }

  let jiraClient: Client;

  for (let i = 0; i < tags.length; i++) {
    switch (tags[i].key) {
      case Key.JIRA_ISSUE:
        if (jiraClient === undefined) {
          jiraClient = new Client(core.getInput("jira-api-token"), core.getInput("jira-domain-name"));
        }

        const matches = pullRequest.title.match(new RegExp("[A-Z]+-[0-9]+"));
        if (matches.length === 0) {
          throw new Error("Unable to find Jira issue key in pull request title");
        }

        const issue = await jiraClient.getIssue(matches[0]);

        tags[i].value = `${jiraClient.baseUrl}/browse/${issue.key}`;
        break;
      default:
        throw new Error(`Unknown tag key found: ${tags[i].key}`);
    }
  }

  pullRequest.body = write(tags, pullRequest.body);
  client.updatePullRequest(pullRequest);
}

run();

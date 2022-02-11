/* eslint-disable no-console */
import * as action from "./action";
import * as core from "@actions/core";
import { Key, read, write } from "./tag";
import { Client } from "./jira";

async function run(): Promise<void> {
  const client = new action.Client(core.getInput("github-token"));

  if (!client.isPullRequest()) {
    console.error("This action can only be run on pull requests.");
    return;
  }

  const pullRequest = await client.getPullRequest();

  const tags = read(pullRequest.body ?? "");
  if (tags.length === 0) {
    console.log("No tags found in this pull request body.");
    return;
  }

  const jiraClient = new Client(core.getInput("jira-api-token"), core.getInput("jira-domain-name"));

  for (const i of tags.keys()) {
    switch (tags[i].key.trim()) {
      case Key.JIRA_ISSUE: {
        const matches = pullRequest.title.match(new RegExp(/[A-Z]+-[0-9]+/));
        if (matches === null || matches.length === 0) {
          throw new Error("Unable to find Jira issue key in pull request title");
        }

        const issue = await jiraClient.getIssue(matches[0]);

        tags[i].value = `${jiraClient.browseBaseUrl}/${issue.key}`;
        break;
      }
      default: {
        throw new Error(`Unknown tag key found: ${tags[i].key}`);
      }
    }
  }

  pullRequest.body = write(tags, pullRequest.body ?? "");
  client.updatePullRequest(pullRequest);
}

run();

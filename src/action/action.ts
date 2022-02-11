import { context, getOctokit } from "@actions/github/lib/github";
import { Event } from "./event";
import { GitHub } from "@actions/github/lib/utils";
import { PullRequest } from "./types";

export class Client {
  private github: InstanceType<typeof GitHub>;

  public constructor(token: string) {
    this.github = getOctokit(token);
  }

  public isPullRequest(): boolean {
    return context.eventName === Event.PULL_REQUEST || context.eventName === Event.PULL_REQUEST_TARGET;
  }

  public async getPullRequest(): Promise<PullRequest> {
    return (
      await this.github.rest.pulls.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: this.pullRequestNumber(),
      })
    ).data;
  }

  private pullRequestNumber(): number {
    if (context.eventName !== Event.PULL_REQUEST && context.eventName !== Event.PULL_REQUEST_TARGET) {
      return 0;
    }

    const parts = context.ref.split("/");
    if (parts.length !== 4) {
      return 0;
    }

    return parseInt(parts[2]);
  }

  public async updatePullRequest(pullRequest: PullRequest): Promise<void> {
    await this.github.rest.pulls.update({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pullRequest.number,
      body: pullRequest.body ?? "",
    });
  }
}

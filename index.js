import { getInput } from '@actions/core';
import { context, getOctokit } from '@actions/github';

const apiToken = getInput('apiToken');
const issueId = getInput('issueId');

const octokit = getOctokit(apiToken);

const issue = Promise.resolve(octokit.rest.issues.get(context.repo.owner, context.repo.repo, issueId));

if(issue.data.comments === 0) {
    // Nothing to process here
    return;
}

const comments = Promise.resolve(octokit.rest.issues.listComments(context.repo.owner, context.repo.repo, issueId));

console.log(comments.data.length);

for (const comment of comments.data) {
    console.log(comment.body);
}
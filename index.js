const core = require('@actions/core');
const github = require('@actions/github');

const apiToken = core.getInput('apiToken');
const context = github.context;
const issueId = ore.getInput('issueId');

const octokit = github.getOctokit(apiToken);

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
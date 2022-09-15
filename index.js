
const core = require('@actions/core');
const github = require('@actions/github');

// Get Inputs
const apiToken = core.getInput('apiToken', { required: true });
const issueNumber = core.getInput('issueNumber', { required: true });

const octokit = github.getOctokit(apiToken);

const owner = github.context.repo.owner;
const repo = github.context.repo.repo

const main = async () => {
    console.log("Getting issue...");
    console.log(`Issue ID: ${issueNumber}`);
    console.log(`Owner: ${owner}`);
    console.log(`Repo: ${repo}`);

    const { data: issue } = await octokit.rest.issues.get({
        owner,
        repo,
        issueNumber
    });

    if (issue.data.comments === 0) {
        console.log("Issue has no comments...");
        // Nothing to process here
        return;
    }

    const { data: comments } = await octokit.rest.issues.listComments({
        owner,
        repo,
        issueNumber
    });

    console.log(`Issue has ${comments.data.length} comment(s)`);

    for (const comment of comments.data) {
        console.log(comment.body);
    }
}

console.log("Calling main");
main();
const command = "/repo";
const core = require('@actions/core');
const github = require('@actions/github');

// Get Inputs
const apiToken = core.getInput('apiToken', { required: true });
const issueNumber = core.getInput('issueNumber', { required: true });
const repoToken = core.getInput('repoToken', { required: true });

const apiOctokit = github.getOctokit(apiToken);
const repoOctokit = github.getOctokit(repoToken);

const owner = github.context.repo.owner;
const repo = github.context.repo.repo

const main = async () => {
    console.log(`Issue ID: ${issueNumber}`);
    console.log(`Owner: ${owner}`);
    console.log(`Repo: ${repo}`);

    console.log("Getting issue...");
    const { data: issue } = await apiOctokit.rest.issues.get({
        owner,
        repo,
        issue_number: issueNumber
    });

    if (issue.comments === 0) {
        console.log("Issue has no comments...");
        // Nothing to process here
        return;
    }

    console.log("Getting issue comments...");
    const { data: comments } = await apiOctokit.rest.issues.listComments({
        owner,
        repo,
        issue_number: issueNumber
    });

    console.log(`Issue has ${comments.length} comment(s)`);

    var latestComment = comments[comments.length - 1];

    if(!latestComment.body_text.includes(command)) {
        repoOctokit.rest.issues.createComment({
            owner,
            repor,
            issue_number: issueNumber,
            body: "A repo command was not found in your last comment."
        })
    }
}

console.log("Calling main");
main();
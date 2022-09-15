
const core = require('@actions/core');
const github = require('@actions/github');

const apiToken = core.getInput('apiToken');
const context = github.context;
const issueId = core.getInput('issueId');

const octokit = github.getOctokit(apiToken);

const main = async () => {
    const issue = await (await octokit.rest.issues.get(context.repo.owner, context.repo.repo, issueId)).data;
    
    if(issue.data.comments === 0) {
        // Nothing to process here
        return;
    }
    
    const comments = (await Promise.resolve(octokit.rest.issues.listComments(context.repo.owner, context.repo.repo, issueId))).data;
    
    console.log(comments.data.length);
    
    for (const comment of comments.data) {
        console.log(comment.body);
    }
}

main();
const core = require('@actions/core');
const github = require('@actions/github');

// Get Inputs
const apiToken = core.getInput('apiToken', { required: true });
const issueNumber = core.getInput('issueNumber', { required: true });
const repoToken = core.getInput('repoToken', { required: true });

const apiOctokit = github.getOctokit(apiToken);
const repoOctokit = github.getOctokit(repoToken);

const command = "/repo";
const commandParameterRegEx = /-[\w]+="[\w\d-\\/_]+"/g
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

    if (!latestComment.body.includes(command)) {
        repoOctokit.rest.issues.createComment({
            owner,
            repo,
            issue_number: issueNumber,
            body: "A repo command was not found in your last comment."
        })
    }

    const matches = latestComment.body.match(commandParameterRegEx);

    const newRepo = {
        owner: "",
        name: "",
        license: "",
        template: ""
    }

    matches.forEach((match) => {
        const parameter = match.split('=')[0].substring(1);
        const value = match.split('=')[1].substring(1, match.split('=')[1].length - 1);

        switch (parameter.toLowerCase()) {
            case "org":
                newRepo.owner = value;
                break;

            case "name":
                newRepo.name = value;
                break;

            case "license":
                newRepo.license = value;
                break;

            case "template":
                newRepo.template = value;
                break;
        }
    });

    await repoOctokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: `Creating a new repo with the following information\r\nOrganization: ${newRepo.owner}\r\nName: ${newRepo.name}\r\nLicense: ${newRepo.license}\r\nTemplate: ${newRepo.template}`
    });

    if (newRepo.template) {
        await apiOctokit.rest.repos.createUsingTemplate({
            template_owner: newRepo.template.split('/')[0],
            template_repo: newRepo.template.split('/')[1],
            owner: newRepo.owner,
            name: newRepo.name
        });
    } else {
        await apiOctokit.rest.repos.createInOrg({
            org: newRepo.owner,
            name: newRepo.name
        });
    }

    const content = Buffer
        .from("# Greetings!\nThis repo was created via IssueOps using a workflow in `tjc-actions-demo/repo-self-service`.", 'utf8')
        .toString('base64');

    await apiOctokit.rest.repos.createOrUpdateFileContents({
        owner: newRepo.owner,
        repo: newRepo.name,
        path: "README.md",
        message: "Initial commit from automation",
        content: content,
        committer: { name: "Repo Self Service", email: "automation@company.local" },
        author: { name: "Repo Self Service", email: "automation@company.local" }
    })

    await repoOctokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: `Your repo has been created`
    });

    await repoOctokit.rest.issues.update({
        owner,
        repo,
        issue_number: issueNumber,
        state: "closed"
    })
}

console.log("Calling main");
main();
---
name: New Repo
about: Create a new repo in the org
title: ''
labels: ''
assignees: 'tj-cappelletti'

---

# Greetings! :wave:
This repo establishes a self-service approach to creating new repos in the organization.
It gives users the flexiblity to create repos as needed, without needing admins to do it for them, while still ensuring the repo meets all organizational requirements.

## How to Use
This self-service IssueOps works via a conversation through the comments on the issue.
To get started, simply add a title and hit the `Submit new issue` button.
Once the issue is created, you can start to add comments to the issue using a specific command syntax.

Examples:
```
/repo -name="example-repo" -license="MIT" -template="owner/repo"
```
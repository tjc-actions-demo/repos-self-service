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

Just a Git Repo:
```
/repo -name="example-repo" -license="MIT" -template="owner/repo"
```

A Repo w/ Actions:
```
/repo -name="example-repo" -license="MIT" -template="owner/repo" -actions="enabled"
```

A Repo w/ Issues:
```
/repo -name="example-repo" -license="MIT" -template="owner/repo" -issues="enabled"
```

A Repo w/ Projects:
```
/repo -name="example-repo" -license="MIT" -template="owner/repo" -projects="enabled"
```

A Repo w/ Everything:
```
/repo -name="example-repo" -license="MIT" -template="owner/repo" -actions="enabled" -issues="enabled" -projects="enabled"
```

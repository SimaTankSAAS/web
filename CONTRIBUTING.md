# DADI Web

## Contributing

We'd love for you to contribute to our source code and to make DADI Web even better.

Here are the guidelines we'd like you to follow:

 - [Question or Problem?](#question)
 - [Issues and Bugs](#issue)
 - [Feature Requests](#feature)
 - [Submission Guidelines](#submit)
 - [Coding Rules](#rules)
 - [Commit Message Guidelines](#commit)

## <a name="question"></a> Got a Question or Problem?

Documentation is maintained under the `docs` branch and can be found on the [dadi.tech](https://dadi.tech) site.

If the documentation doesn't answer your problem please feel free to email the
DADI team [directly](team@dadi.tech).

## <a name="issue"></a> Found an Issue?
If you find a bug in the source code or a mistake in the documentation, you can help us by
submitting an issue to our [GitHub Repository][github]. We'd love it if you
submitted a Pull Request with a fix instead!

**Please see the Submission Guidelines below**.

## <a name="feature"></a> Want a Feature?
You can request a new feature by submitting an issue to our [GitHub][github] issue tracker.
If you would like to implement a new feature then consider what kind of change it is:

* **Major Changes** that you wish to contribute to the project should be added as
a Feature Request in the [GitHub][github] issue tracker. This will get the conversation
started.
* **Small Changes** can be crafted and submitted to the [GitHub Repository][github] as a Pull Request.

## <a name="submit"></a> Submission Guidelines

### Submitting an Issue
Before you submit your issue [search the archive][issues], maybe your question was already answered.

If your issue appears to be a bug, and hasn't been reported, open a new issue.
Help us to maximize the effort we can spend fixing issues and adding new
features, by not reporting duplicate issues.  Providing the following information will increase the
chances of your issue being dealt with quickly:

* **Overview of the Issue** - if an error is being thrown a non-minified stack trace helps
* **Motivation for or Use Case** - explain why this is a bug for you
* **DADI Web Version**
* **Operating System**
* **Steps to Reproduce** - provide a set of steps to follow to reproduce the error.
* **Related Issues** - has a similar issue been reported before?
* **Suggest a Fix** - if you can't fix the bug yourself, perhaps you can point to what might be
  causing the problem (line of code or commit)

### Submitting a Pull Request
Before you submit your pull request consider the following guidelines:

* Search [GitHub][pulls] for an open or closed Pull Request
  that relates to your submission. You don't want to duplicate effort.
* Make your changes in a new git branch:

 ```shell
 git checkout -b my-fix-branch master
 ```

* Create your patch, **including appropriate test cases**.
* Follow our [Coding Rules](#rules).
* Run the full test suite using `npm test` and ensure that all tests pass.
* Commit your changes using a descriptive commit message that follows our
  [commit message conventions](#commit-message-format) and passes our commit message presubmit hook. Adherence to the [commit message conventions](#commit-message-format) is required because release notes are automatically generated from these messages.

   ```shell
   git commit -a
   ```
  Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

* Push your branch to GitHub:

  ```shell
  git push origin my-fix-branch
  ```

* In GitHub, send a pull request to `web:master`.
* If we suggest changes then:
  * Make the required updates.
  * Re-run the full test suite to ensure tests are still passing.
  * Commit your changes to your branch (e.g. `my-fix-branch`).
  * Push the changes to GitHub (this will update your Pull Request).

If the PR gets too outdated we may ask you to rebase and force push to update the PR:

  ```shell
  git rebase master -i
  git push origin my-fix-branch -f
  ```

*WARNING. Squashing or reverting commits and forced push thereafter may remove GitHub comments on code that were previously made by you and others in your commits.*

That's it! Thank you for your contribution!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes from the main (upstream) repository:

* Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

  ```shell
  git push origin --delete my-fix-branch
  ```

* Check out the master branch:

  ```shell
  git checkout master -f
  ```

* Delete the local branch:

  ```shell
  git branch -D my-fix-branch
  ```

* Update your master with the latest upstream version:

  ```shell
  git pull --ff upstream master
  ```

## <a name="rules"></a> Coding Rules
To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested** by one or more tests. Browse the [test
suite][tests] for examples.
* All public API methods **must be documented** with [JSDoc](http://usejsdoc.org/).

## <a name="commit"></a> Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more readable messages** that are easy to follow when looking through the **project history**.  We also use the git commit messages to **generate the change log**.

The commit message format validation can be initialised by running `npm run init` from the root of the repository. This will add a symlink at `.git/hooks/commit-msg` which will be run every time you commit.

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special format that includes a **type** and a **subject**:

```
type: subject

Optional long description

Fix #xxx
Close #yyy
Ref #zzz
```

Any line of the commit message cannot be longer 100 characters. This allows the message to be easier to read on GitHub as well as in various git tools.

> ### Reverting
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Subject
The subject contains a succinct description of the change:

* use the imperative, present tense: "fix" not "fixed" nor "fixes"
* don't capitalize first letter
* no dot (.) at the end

### Body
Just as in the **subject**, write your commit message in the imperative: "Fix bug" and not "Fixed bug" or "Fixes bug". This convention matches up with commit messages generated by commands like `git merge` and `git revert`.

The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.


[github]: https://github.com/dadi/web
[issues]: https://github.com/dadi/web/issues
[pulls]: https://github.com/dadi/web/pulls
[tests]: https://github.com/dadi/web/tree/master/test
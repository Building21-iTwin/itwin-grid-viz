# iTwin Grid Viz

This application is an experiment in visualizing iModel data in both the view and in an excel like table.

## npm Commands

- `npm install`: install dependencies
- `npm start`: start debug server
- `npm build`: build production server

## git commands

- `git pull`: get the latest changes from the server
- `git status`: get the status of your local repo
- `git diff`: show local changes line by line.  Type `q` to exit
- `git add <filepath>`: add a new file to the repo.  To add a file called `banana.ts` in the `src/fruits` folder you would use the command `git add src/fruits/banana.ts`
- `git commit -m"Some message" -a`: Commit all local changes, replace some message with some better message.
- `git push`: Push committed changes to the current branch
- `git checkout <someBranch>`: switch to a branch.  To switch to a branch called `banana` use the command `git checkout banana`
- `git checkout -B <someNewBranch>`: Create a new branch and switch to it.  To create a new branch called banana use the command `git checkout -B banana`

For more helpful git commands see this [GitHub Cheat sheet](https://education.github.com/git-cheat-sheet-education.pdf)

## git config commands

You must do these before you can commit changes

1. set a name that is identifiable for credit when review version history
```bash
git config --global user.name “[firstname lastname]”
```
2. set an email address that will be associated with each history marker
```bash
git config --global user.email “[valid-email]”
```
3. set automatic command line coloring for Git for easy reviewing
```bash
git config --global color.ui auto
```

List all configs to make sure these settings wer applied correctly
```bash
git config --list
```

Here is an example setting user name to Mojo Jojo and email to Mojo.Jojo@bentley.com
```bash
git config --global user.name “Mojo Jojo”
git config --global user.email “Mojo.Jojo@bentley.com”
```
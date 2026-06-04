# Momo Aux Platines

## Workflow Git

Tous les commits et push passent par la conversation **Push to GitHub** uniquement.
Cette conversation (Figma sync) ne génère JAMAIS de commandes git — elle modifie les fichiers, c'est tout.

### Quand on demande de pousser

1. git pull origin main --rebase
2. git status
3. git diff + git diff --cached
4. Regrouper par theme, un commit par theme
5. git add fichiers concernes
6. git commit
7. git push origin main

### Convention commits

feat(admin): nouvelle fonctionnalite
fix(admin): correction bug
style(admin): changements visuels

### Patches Cowork

Apres pbpaste | bash, verifier "N/N changes applied" avant de commiter.

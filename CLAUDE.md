# Momo Aux Platines

## Âme du projet (soul)

Avant toute tâche touchant au contenu, à la copy, au design, à l'UX ou au ton,
lire **`soul/soul.md`** et s'y aligner. C'est la source de vérité de la voix de Momo.

En résumé : le DJing comme partage et création de lien humain. Momo curate des
ambiances, mixe les morceaux « comme s'ils se connaissaient », lit la salle,
accueille les demandes, transmet son art. Ton et décisions guidés par :
**simplicité, tact, chaleur, ouverture, curiosité, générosité, authenticité.**

En cas de doute entre plusieurs options, choisir celle qui sert le mieux ces mots.

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

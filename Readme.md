# React


## Premier Projet React

npm create vite@latest course -- --template react-ts

## Récupérer le Projet
```
npm install
```

## Start Project
```
npm run api
npm run dev
```

## Structure de projets
Suivant la taille du projet:
- intermédiaire : découpage par type de composant (component, service, types, reducers, ...)
- grand projet : découpage par grande fonctionnalité (+ sous partie)
- multi-projets : site + librairies => gestion des dépendances entre projets

Gestion des imports:
- chemin relatif : éviter ../../../../A/B/C => import @/ (à configurer)
- import dynamique: import() + React.lazy ou Suspense



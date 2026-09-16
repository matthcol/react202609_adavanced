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

## Linter
Exemples de Code Smell: 

* react-hooks/exhaustive-deps: dépendances du hook useEffect (ou useMemo ou useCallback)
```
const ListeProduits: FC<ListeProduitsProps> = ({ numPage, nbProduitPage }) => {
  const [produits, setProduits] = useState<Produit[]>([]);

  useEffect(() => {
    firstValueFrom(loadPageProduits(numPage, nbProduitPage)).then(setProduits)
  }, [numPage])

  # ...
}
```

Donne:
```
  17:6  warning  React Hook useEffect has a missing dependency: 'nbProduitPage'. Either include it or remove the dependency array 
```

* react-refresh/only-export-components:
Un fichier qui export un composant n'exporte pas de constantes et fonctions

* react-hooks/rules-of-hooks : interdit  d'appeler un hook dans une condition, 1 boucle ou après un return anticipé


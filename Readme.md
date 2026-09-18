# React
## Sommaire
Le projet existe en plusieurs versions :

## Premier Projet React - Client classique

```
npm create vite@latest course -- --template react-ts
```

## Installation si clone Projet
```
npm install
```

## Start Project
```
npm run api  # json-server sert la base JSON
npm run dev
```

## Structure de projets - Code Splitting
***Suivant la taille du projet :***
- intermédiaire : découpage par type de composant (component, service, types, reducers, ...)
- grand projet : découpage par grande fonctionnalité (+ sous partie)
- multi-projets : site + librairies => gestion des dépendances entre projets

***Gestion des imports :***
- chemin relatif : éviter ../../../../A/B/C => import @/ (à configurer)
- import dynamique: import() + React.lazy ou Suspense

***Liens :***
- [React – `lazy`](https://react.dev/reference/react/lazy) /
  [`Suspense`](https://react.dev/reference/react/Suspense)
- [Vite – Building for Production (chunking)](https://vitejs.dev/guide/build.html)

## Linter
***Exemples de Code Smell :***

* `react-hooks/exhaustive-deps` : exhaustivité des dépendances du hook useEffect (ou useMemo ou useCallback)

Exemple : 
```typescript
const ListeProduits: FC<ListeProduitsProps> = ({ numPage, nbProduitPage }) => {
  const [produits, setProduits] = useState<Produit[]>([]);

  useEffect(() => {
    firstValueFrom(loadPageProduits(numPage, nbProduitPage)).then(setProduits)
  }, [numPage])

  # ...
}
```

Produit l'erreur suivante :
```
warning  React Hook useEffect has a missing dependency: 'nbProduitPage'. Either include it or remove the dependency array 
```

* `react-refresh/only-export-components` :
un fichier qui export un composant n'exporte pas de constantes et fonctions

* `react-hooks/rules-of-hooks` : interdit  d'appeler un hook dans une condition, 1 boucle ou après un return anticipé

***Liens :***
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [Guide de migration ESLint flat config](https://eslint.org/docs/latest/use/configure/migration-guide)


## React Dev Tools - Cycle de vie des objets
Extension disponible pour Chrome, Firefox, ...

***Onglets :***
- Components : arborescence des coposants avec leurs states et props
- Profiler : enregistre une séquence et permet de revisualiser les cycles de vie de chaque composant et le temps consommé pour chaque cycle. 1 cycle = 1 commit.
- Suspense : visualisation du avant/après

***Liens :***
- [React DevTools – Profiler](https://react.dev/blog/2018/09/10/introducing-the-react-profiler)
- [Documentation officielle de l'extension](https://react.dev/learn/react-developer-tools)


## Hooks
***Définition :***
- commence par 'use'
- fonction pure : calcul, data, pas de GUI

***Liste (non exhaustive):***
* State
  - `useSate`
  - `useReducer`

* Reference et DOM
  - `useRef`
  - `useId` (utile en SSR)

* Contexte
  - `useContext`

* Performance
  - `useMemo` : mémoïse 1 valeur dérivée
  - `useCallback` : mémoïse 1 reference de méthode

* Actions
  - `use` : promesse<Data> => ref Data
  - `useActionState`, `useFormStatus` : Forms
  - `useOptimistic`

* Effects
  - `useFfect` : [après] effets de bord (call API, DB)
  - `useLayoutEffect` : [avant]
  - `useInsertEffect` : CSS


***Exemple :***
```typescript
export function useCart(products: Product[]): UseCartResult {
  const [cart, setCart] = useState<Record<string, number>>(readStoredCart)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // Stockage indisponible (navigation privée, quota dépassé...) : tant pis, pas de persistance.
    }
  }, [cart])

  const addToCart = useCallback((productId: string) => {
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }))
  }, [])

  const decrementFromCart = useCallback((productId: string) => {
    setCart((current) => {
      const nextQuantity = (current[productId] ?? 0) - 1
      if (nextQuantity <= 0) {
        const next = { ...current }
        delete next[productId]
        return next
      }
      return { ...current, [productId]: nextQuantity }
    })
  }, [])

  const clearCart = useCallback(() => setCart({}), [])

  const itemsInCart = useMemo(
    () => Object.values(cart).reduce((total, quantity) => total + quantity, 0),
    [cart],
  )

  const total = useMemo(
    () => products.reduce((sum, product) => sum + (cart[product.id] ?? 0) * product.price, 0),
    [products, cart],
  )

  return { cart, itemsInCart, total, addToCart, decrementFromCart, clearCart }
}
```

***Liens :***
- [React – Référence de tous les hooks](https://react.dev/reference/react/hooks)
- [React – Règles des hooks](https://react.dev/reference/rules/rules-of-hooks)
- [React – Nouveautés de React 19 (Actions, `use`, `useActionState`...)](https://react.dev/blog/2024/12/05/react-19)
- [React – Réutiliser la logique avec des hooks personnalisés](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [React – `createContext`](https://react.dev/reference/react/createContext) /
  [`useContext`](https://react.dev/reference/react/useContext)
- [React – Passer des données en profondeur avec le contexte](https://react.dev/learn/passing-data-deeply-with-context)
- [Kent C. Dodds – How to optimize your context value](https://kentcdodds.com/blog/how-to-optimize-your-context-value)

## Tests
***Settings :***
Utilisation et configuration de Vitest. Extension VCCode Vitest (ou équivalent autre IDE).
```shell
npm install --save-dev vitest @vitest/coverage-istanbul 
```

***Quelques astuces :***
- fonction render() pour la mise en place des composants
- trigger UI avec fireEvent ou userEvent
- renderHook() pour mise en place d'un hook dans un composant virtuel
- act() : declenchement changement état (hook)
- mock : vi.fn() + MSW (Mocke Service Worker (interception HTTP)
- screen.debug(...)

***Exemple mock HTTP :***

```typescript
export const handlers = [
  http.get('/api/products', () => HttpResponse.json(testProducts)),

  http.post('/api/checkout', async ({ request }) => {
    const body = (await request.json()) as CheckoutRequestBody

    const items: OrderConfirmation['items'] = body.items.map((line) => {
      const product = testProducts.find((candidate) => candidate.id === line.productId)
      return {
        productId: line.productId,
        name: product?.name ?? line.productId,
        quantity: line.quantity,
        subtotal: (product?.price ?? 0) * line.quantity,
      }
    })

    const confirmation: OrderConfirmation = {
      orderId: 'test-order-id',
      total: items.reduce((sum, item) => sum + item.subtotal, 0),
      items,
    }

    return HttpResponse.json(confirmation, { status: 201 })
  }),
]
```

***Liens :***
- [Testing Library – `renderHook`](https://testing-library.com/docs/react-testing-library/api/#renderhook)
- [React – `act`](https://react.dev/reference/react/act)
- [Testing Library – Guiding Principles](https://testing-library.com/docs/guiding-principles/)
- [Testing Library – `user-event`](https://testing-library.com/docs/user-event/intro/)
- [Testing Library – Async methods (`findBy`, `waitFor`)](https://testing-library.com/docs/dom-testing-library/api-async/)
- [Vitest – Mocking (`vi.fn`, `vi.stubGlobal`)](https://vitest.dev/api/vi.html)
- [Mock Service Worker – Getting started](https://mswjs.io/docs/getting-started)
- [Vitest – `vi.mock`](https://vitest.dev/api/vi.html#vi-mock)

## SSR (Server Side Rendering)

### Justifications
Business/produit et/ou Technique:

***SEO et partage social***
Les moteurs de recherche et les crawlers de réseaux sociaux (Facebook, Twitter/X, LinkedIn) exécutent parfois mal ou pas du tout le JavaScript. Si le contenu doit être indexé correctement ou générer de belles previews avec meta tags, le SSR (ou SSG) garantit que le HTML complet est déjà présent.

***Performance perçue (Time to First Paint)***
Avec un CSR pur, l'utilisateur voit un écran blanc le temps que le bundle JS se charge et s'exécute. Le SSR envoie du HTML déjà rendu, donc le contenu s'affiche immédiatement, même si l'interactivité (hydration) arrive un peu après.

***Utilisateurs avec connexions lentes ou devices peu puissants***
Moins de travail JS à faire avant d'avoir quelque chose à l'écran, ce qui aide beaucoup sur mobile bas de gamme ou réseau 3G.

***Core Web Vitals / métriques de performance***
Google utilise des métriques comme LCP (Largest Contentful Paint) dans son classement. Le SSR améliore souvent ces scores par rapport au CSR pur.

***Contenu dynamique par utilisateur mais quand même indexable***
Contrairement au SSG (statique), le SSR permet de générer du HTML à la demande avec des données personnalisées (session, géolocalisation, etc.) tout en gardant les bénéfices du rendu serveur.

### Exemple de découpage
***SSG (statique, généré au build) — pages qui changent peu***

- Pages "À propos", CGV, blog éditorial, landing pages marketing
- Éventuellement les pages catégories si le catalogue est stable

***ISR (statique régénéré périodiquement) — le cœur du catalogue***

- Fiches produit : régénérées toutes les X minutes ou à la demande (revalidation)
- Compromis idéal : SEO parfait (HTML déjà là), perf de CDN, mais le stock/prix peuvent avoir quelques minutes de retard
- Next.js revalidate: 60 par exemple — le produit reste "assez frais" sans recalculer à chaque requête

***SSR pur (rendu à chaque requête) — contenu personnalisé/volatile***

- Page de résultats de recherche avec filtres complexes (trop de combinaisons pour du SSG)
- Prix personnalisés (promo selon compte, devise selon géolocalisation)
- Disponibilité stock en temps réel si c'est un argument de vente critique (ex: "plus que 2 en stock")

***CSR pur (client-side) — tout ce qui est interaction/session***

- Panier
- Compte utilisateur, historique de commandes
- Processus de checkout (souvent derrière auth, SEO inutile ici)
- Widgets interactifs : filtres dynamiques, zoom image, configurateur produit

### Types de composants :
* SSR pur : le même composant tourne côté serveur (génération HTML) et côté client (hydratation)

* Next.js :
  - React Server Components (RSC) : mode par défaut (pas de useState, useEffect, ...), accès privilégié côté serveur
  - Client Component : directive "use client" (useStae, useEffect), génération de DOM par JS
 
### Création du projet SSR
Intégré dans la branche `feature/05-ssr`.

```shell
npx create-next-app@latest course-next
```

### Liens
* SSR pur :
- [React – `renderToString`](https://react.dev/reference/react-dom/server/renderToString) /
  [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot)
- [React – `renderToPipeableStream`](https://react.dev/reference/react-dom/server/renderToPipeableStream) (streaming SSR)
- [Vite – Server-Side Rendering Guide](https://vitejs.dev/guide/ssr.html)

* SSR / Next.js :
- [Next - Rendu des composants côté serveur](nextjs.org/docs/app/getting-started/server-and-client-components) 
- [Next - Fetch data from server side](nextjs.org/docs/app/getting-started/fetching-data)
- [Next -Tutorial](nextjs.org/learn/dashboard-app)

 ## Routing
 - client side (=> masquer URL reelle)
    * routing react pur
    * routing redux
    * reactive native
 - ssr
    * next.js

***Liens :***
- [React Router – Documentation officielle](https://reactrouter.com/)
- [React – Vous n'avez peut-être pas besoin d'un effet (section navigation)](https://react.dev/learn/you-might-not-need-an-effect)
- [Next - Getting started routing](nextjs.org/docs/app/getting-started/layouts-and-pages)
- [web.dev – Client-side vs server-side routing](https://web.dev/articles/rendering-on-the-web)


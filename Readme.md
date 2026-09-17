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

Liens:
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [Guide de migration ESLint flat config](https://eslint.org/docs/latest/use/configure/migration-guide)


## React Dev Tools - Cycle de vie des objets

TODO: liens

## Hooks
Définition:
- commence par 'use'
- fonction pure: calcul, data, pas de GUI

Liste:
* State
- useSate
- useReducer

* Reference et DOM
- useRef
- useId (utile en SSR)

* Contexte
- useContext

* Performance
- useMemo : mémoïse 1 valeur dérivée
- useCallback : mémoïse 1 reference de méthode

* Actions
- use : promesse<Data> => ref Data
- useActionState, useFormStatus : Form
- useOptimistic

* Effects
- useFfect : [après] effets de bord (call API, DB)
- useLayoutEffect : [avant]
- useInsertEffect : CSS


Exemple:
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

## Tests
Utilisation de Vitest: TODO autres dependances
```
npm install --save-dev vitest @vitest/coverage-istanbul 
```

Extension VSCode : vitest

Quelques astuces:
- fonction render() pour la mise en place des composants
- trigger UI avec fireEvent ou userEvent
- renderHook() pour mise en place d'un hook dans un composant virtuel
- act() : declenchement changement état (hook)
- mock : vi.fn() + MSW (http)
- screen.debug(...)

Exemple mock HTTP:

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
import { describe, expect, it } from 'vitest'
import { panierReducer } from './panierReducer'
import type { Panier } from '../types/panier'

describe('panierReducer', () => {

    it('ajoute une ligne article dans un panier vide', () => {
        const panier: Panier = []
        const newPanier = panierReducer(panier, { type: 'ajouterProduit', idProduit: 1, quantite: 2, price: 3.5 })
        expect(newPanier).toEqual([{ idProduit: 1, quantite: 2, price: 3.5 }])
    })

    it('ajoute une ligne article supplémentaire sans fusionner avec une ligne existante', () => {
        const panier: Panier = [{ idProduit: 1, quantite: 2, price: 3.5 }]
        const newPanier = panierReducer(panier, { type: 'ajouterProduit', idProduit: 2, quantite: 1, price: 5 })
        expect(newPanier).toEqual([
            { idProduit: 1, quantite: 2, price: 3.5 },
            { idProduit: 2, quantite: 1, price: 5 }
        ])
    })

    it('supprime la ligne article correspondant au produit', () => {
        const panier: Panier = [
            { idProduit: 1, quantite: 2, price: 3.5 },
            { idProduit: 2, quantite: 1, price: 5 }
        ]
        const newPanier = panierReducer(panier, { type: 'supprimerProduit', idProduit: 1 })
        expect(newPanier).toEqual([{ idProduit: 2, quantite: 1, price: 5 }])
    })

    it('ne modifie pas le panier si le produit à supprimer est absent', () => {
        const panier: Panier = [{ idProduit: 1, quantite: 2, price: 3.5 }]
        const newPanier = panierReducer(panier, { type: 'supprimerProduit', idProduit: 99 })
        expect(newPanier).toEqual(panier)
    })

    it('modifie la quantité de la ligne article correspondante', () => {
        const panier: Panier = [{ idProduit: 1, quantite: 2, price: 3.5 }]
        const newPanier = panierReducer(panier, { type: 'modifierProduit', idProduit: 1, quantite: 5 })
        expect(newPanier).toEqual([{ idProduit: 1, quantite: 5, price: 3.5 }])
    })

    it('supprime la ligne article si la quantité modifiée est à 0', () => {
        const panier: Panier = [
            { idProduit: 1, quantite: 2, price: 3.5 },
            { idProduit: 2, quantite: 1, price: 5 }
        ]
        const newPanier = panierReducer(panier, { type: 'modifierProduit', idProduit: 1, quantite: 0 })
        expect(newPanier).toEqual([{ idProduit: 2, quantite: 1, price: 5 }])
    })
})

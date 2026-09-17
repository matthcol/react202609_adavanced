import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Produit } from '../types/produit'
import VignetteProduit from './VignetteProduit'
import type { Panier } from '../types/panier'
import { ContextPanier } from '../contextes/ContextPanier'

// setup
const produit: Produit = {
    Id:92,
    Libelle: "Chips Pom'lisse Nature - 6x30g",
    Prix:1.47,
    PhotoListe: "https:\/\/fd4-photos.leclercdrive.fr\/image.ashx?id=2917317&use=d&cat=p&typeid=i",
    PhotoDetail: "https:\/\/fd4-photos.leclercdrive.fr\/image.ashx?id=2917316&use=l&cat=p&typeid=i",
    FiltresMarque: ["Marque Rep\u00e8re","Pom' lisse"],
    FiltresEnCeMoment:[],
    FiltresLabelsQualite:[],
    FiltresNutriscore:["B"],
    IdRangement: "284319|284424|284447",
    Url: "https:\/\/fd4-courses.leclercdrive.fr\/magasin-103101-Roques-sur-Garonne-Toulouse\/fiche-produits-92--.aspx"
}

function renderVignette() {
    const panier: Panier = []; // TODO: à gérer en param
    render(
        <ContextPanier.Provider value={{ panier, dispatch: vi.fn() }}>
            <VignetteProduit produit={produit} />
        </ContextPanier.Provider>
    )
}

describe('VignetteProduit', () => {

    it('display produit with all infos', () => {
        // render Vignette
        renderVignette();

        // verify display
        // .getByText => throw error if not found
        // .queryByText => return null if not found
        expect(screen.getByText("Chips Pom'lisse Nature - 6x30g")).toBeInTheDocument()
        expect(screen.getByText("Prix : 1.47€")).toBeInTheDocument()
        expect(screen.queryByText("92")).not.toBeInTheDocument()
        expect(screen.getByRole('img', {name: "Chips Pom'lisse Nature - 6x30g" }))
            .toHaveAttribute('src', produit.PhotoListe)
        // TODO: others
    })

    // TODO :
    //  act : trigger + (add produit) + verify (mock) que ajouterProduit dans le panier a été appelé
})

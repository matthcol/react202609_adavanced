"use server";

import { getProduitAleatoire, Produit } from "@/services/produitService";

export type FragmentServeur = {
    genereLe: string;
    produit: Produit;
};

export async function chargerFragmentServeur(): Promise<FragmentServeur> {
    // Calcul effectué côté serveur : date de génération + produit tiré au sort
    const produit = getProduitAleatoire();

    return {
        genereLe: new Date().toLocaleTimeString("fr-FR"),
        produit,
    };
}

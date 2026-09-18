import produits from "@/data/produits.json";

export type Produit = {
    Id: number;
    Libelle: string;
    Prix: number;
    PhotoListe: string;
    PhotoDetail: string;
    FiltresMarque: string[];
    FiltresEnCeMoment: string[];
    FiltresLabelsQualite: string[];
    FiltresNutriscore: string[];
    IdRangement: string;
    Url: string;
};

export const getProduitPhares = (): Produit[] => {
    return (produits as Produit[]).slice(0, 10);
};

export const getProduitAleatoire = (): Produit => {
    const liste = produits as Produit[];
    const index = Math.floor(Math.random() * liste.length);
    return liste[index];
};

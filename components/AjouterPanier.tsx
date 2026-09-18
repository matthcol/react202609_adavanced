"use client";

import { Produit } from "@/services/produitService";

type AjouterPanierProps = {
    produit: Produit;
};

const AjouterPanier = ({ produit }: AjouterPanierProps) => {
    const handleClick = () => {
        // TODO: gérer l'ajout réel au panier
        console.log("Ajout au panier :", produit);
    };

    return (
        <button className="btn-client" onClick={handleClick}>
            Ajouter au panier
        </button>
    );
};

export default AjouterPanier;

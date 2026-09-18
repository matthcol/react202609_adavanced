import { Produit } from "@/services/produitService";
import AjouterPanier from "@/components/AjouterPanier";

type ListeProduitAccueilProps = {
    produits: Produit[];
};

const ListeProduitAccueil = ({ produits }: ListeProduitAccueilProps) => {
    return (
        <div className="zone-serveur">
            <h1>Accueil</h1>
            Liste des produits du moment
            <ul>
                {produits.map((produit) => (
                    <li key={produit.Id}>
                        {produit.Libelle} - {produit.Prix} €
                        <AjouterPanier produit={produit} />
                    </li>
                ))}
            </ul>
            Note : voir les interactions clients dans la console.
        </div>
    );
}

export default ListeProduitAccueil;

import { LigneArticle } from "./LigneArticle";
import './CartouchePanier.css';
import usePanier from "../hooks/panierHook";
import { useMemo } from "react";

// type CartouchePanierProps = {
//     panier: Panier,
//     handleRemoveProduit: (idProduit: number) => void
// }

// const CartouchePanier: FC<CartouchePanierProps> = ({panier, handleRemoveProduit}) => {

type CartouchePanierProps = {
    valid: boolean
}

const CartouchePanier = ({valid}: CartouchePanierProps ) => {
    // TODO : add other dependency
    const {panier} = usePanier()

    // sans Memo : const total = panier.map(({quantite, price}) => quantite * price).reduce((t1, t2) => t1 + t2, 0)
    const total = useMemo<number>(
        () => panier.map(({quantite, price}) => quantite * price).reduce((t1, t2) => t1 + t2, 0),
        [panier]  // dependency du calcul
    )
    return (
        <div className="cartouchePanier">
            <div>Valide: {valid ? 'validé' : 'en cours'}</div>
            <div>Nombre d'articles: {panier.length}</div>
            <div>Total: {total}</div>
            {
                panier.map(({idProduit, quantite, price}, i) => 
                    <LigneArticle idProduit={idProduit} quantite={quantite} index={i} price={price} key={`la_${i}`} />
                )
            }
        </div>
    )
} 

export default CartouchePanier
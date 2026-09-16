import { useContext } from "react";
import { ContextPanier, type ContextPanierValue } from "../contextes/ContextPanier";

// custom Hook pour recuperer le panier si disponible
function usePanier(): ContextPanierValue {
      const contextPanier = useContext(ContextPanier)
      if (!contextPanier) {
        throw new Error("Utilisation du panier sans mise en place du provider")
      }
      return contextPanier
}

export default usePanier;
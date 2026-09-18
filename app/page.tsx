import ListeProduitAccueil from "@/components/ListeProduitAccueil";
import FragmentDynamique from "@/components/FragmentDynamique";
import { getProduitPhares } from "@/services/produitService";

export default async function Home() {
  // server side : appel db, api, ...
  const produits = getProduitPhares();

  return (
    <main>
      <div>Note : utiliser l'inspecteur de code pour observer les interactions entre le client et le serveur.
        La console logue le côté client et le body response permet de voir le code HTML généré côté serveur.</div>
      <ListeProduitAccueil produits={produits} />
      <FragmentDynamique />
    </main>
  );
}

import { use, type FC } from 'react';
import type { Produit } from '../types/produit';
import VignetteProduit from './VignetteProduit';

type ListeProduitsProps = {
  produitsPromise: Promise<Produit[]>,
}

const ListeProduits: FC<ListeProduitsProps> = ({ produitsPromise }) => {
  const produits = use(produitsPromise);

  return (
    <div className='listeProduit'>
      {produits.map((produit, index) => (
        <VignetteProduit
          key={`vnp_${index}`}
          produit={produit}
        />
      ))}
    </div>
  )
}

export default ListeProduits;

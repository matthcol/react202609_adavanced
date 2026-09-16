import { useEffect, useState, type FC } from 'react';
import { firstValueFrom } from 'rxjs';
import loadPageProduits from '../services/catalogueService';
import type { Produit } from '../types/produit';
import VignetteProduit from './VignetteProduit';

type ListeProduitsProps = {
  numPage: number,
  nbProduitPage: number,
}

const ListeProduits: FC<ListeProduitsProps> = ({ numPage, nbProduitPage }) => {
  const [produits, setProduits] = useState<Produit[]>([]);

  useEffect(() => {
    firstValueFrom(loadPageProduits(numPage, nbProduitPage)).then(setProduits)
  }, [numPage, nbProduitPage])

  return (
    <div className='listeProduit'>
      {produits.map((produit, index) => (
        <VignetteProduit
          key={`vgntprod_${index}`}
          produit={produit}
        />
      ))}
    </div>
  )
}

export default ListeProduits;

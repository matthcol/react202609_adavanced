import { Suspense, useContext, useState, type ChangeEvent } from 'react';
import { firstValueFrom } from 'rxjs';

import './App.css';
import { range } from '../utils';

import CartouchePanier from './CartouchePanier';
import ListeProduits from './ListeProduits';
import { ContextCompteur } from '../main';
import type { Produit } from '../types/produit';

function App() {
  const [produitsPromise, setProduitsPromise] = useState<Promise<Produit[]> | null>(null)
  const [nbProduitPage, setNbProduitPage] = useState<number>(10)
  const [numPage, setNumPage] = useState<number>(1)
  
  
  const compteur = useContext(ContextCompteur)

  // data recalculées à chaque re-rendering déclenché par un changement de state (nbProduitPage ou numPage)
  const firstIndexProduit = (numPage - 1) * nbProduitPage // included
  const lastIndexProduit = numPage  * nbProduitPage // excluded
  const nbPage = 10
  const pages = range(nbPage, 1)

  console.log('Pages:', pages)
  console.log(`Display produits: page=${numPage} de ${firstIndexProduit} à ${lastIndexProduit}`)

  const handleLoad = () => {
    console.log('Chargement des données (déclenché par le bouton LOAD)')
    setProduitsPromise(
      import('../services/catalogueService')
        .then(({ default: loadPageProduits }) => firstValueFrom(loadPageProduits(numPage, nbProduitPage)))
    )
  }

  // useEffect(() => {
  //   // phase 1 : fait qd le useEffect est joué
  //   const intervalId = setInterval(() => {
  //     console.log('Chargement des données Refresh')
  //     setProduitsData(_produitsData.slice(0, 20))
  //   }, 5000)

    // phase 2 : fait avant de rejouer l'effet
  //   return () => clearInterval(intervalId)
  // }, [produitsData])

  const handleChangeNbProduitPage = (e: ChangeEvent<HTMLSelectElement>) => {
    const newNbProduitPage = Number(e.target.value)
    setNbProduitPage(newNbProduitPage)
    setNumPage(1)
    console.log('Changement du nb de produits par page:', 
      newNbProduitPage, // nouvelle valeur calculée localement
      nbProduitPage // toujours l'ancienne valeur jusqu'au prochain render
    )
  }

  const handleChangePage = (numPage: number) => {
    console.log("Changement de page:", numPage)
    setNumPage(numPage)
  }

  // handlers modifiant 1 tableau:
  // tips: https://react.dev/learn/updating-arrays-in-state
  
  // const handleAddProduit = (idProduit: number, quantite: number) => {
  //   dispatch({
  //     type: 'ajouterProduit',
  //     idProduit: idProduit,
  //     quantite: quantite
  //   })
  // }

  // const handleRemoveProduit = (idProduitToRemove: number) => {
  //   dispatch({
  //     type: 'supprimerProduit',
  //     idProduit: idProduitToRemove
  //   })
  // }
  
  return (
     <div className="app-container">
      {/* Header avec compteur */}
      <div className="app-header">
        <div>Compteur : {compteur}</div>
      </div>

      {/* Panier sticky */}
      <div className="panier-section">
        <CartouchePanier />
      </div>
    
          {/* Contrôles de pagination et taille */}
      <div className="controls-container">
      <div className='taillePage'>
          <select value={nbProduitPage} onChange={handleChangeNbProduitPage}>
             <option value="10">10</option>
             <option value="25">25</option>
             <option value="50">50</option>
        </select>
      </div>
      <div className='navigation'>
        { pages.map(numPage => (
            <button
              onClick={() => handleChangePage(numPage)}
              key={`page_${numPage}`}
            >
              {numPage}
            </button>
          ))
        }
      </div>
      <div className='chargement'>
        <button onClick={handleLoad}>LOAD</button>
      </div>
      </div>

        {/* Liste des produits */}
      {produitsPromise && (
        <Suspense fallback={<div>Chargement des produits...</div>}>
          <ListeProduits produitsPromise={produitsPromise} />
        </Suspense>
      )}
    </div>
  )
}

export default App;
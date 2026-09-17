type LigneArticle = {
    idProduit: number
    quantite: number
    price: number
}

type Panier = LigneArticle[]

export {type LigneArticle, type Panier}
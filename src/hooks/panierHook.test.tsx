import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import usePanier from './panierHook'
import { ContextPanierProvider } from '../contextes/ContextPanier'

describe('usePanier', () => {

    it('lève une erreur si utilisé hors du ContextPanierProvider', () => {
        expect(() => renderHook(() => usePanier())).toThrow(/sans mise en place du provider/i)
    })

    it('expose un panier vide initialement et un dispatch branché sur le reducer', () => {
        const { result } = renderHook(() => usePanier(), { wrapper: ContextPanierProvider })

        expect(result.current.panier).toEqual([])

        act(() => {
            result.current.dispatch({ type: 'ajouterProduit', idProduit: 1, quantite: 2, price: 3.5 })
        })

        expect(result.current.panier).toEqual([{ idProduit: 1, quantite: 2, price: 3.5 }])
    })
})

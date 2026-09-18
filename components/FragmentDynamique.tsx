"use client";

import { useState, useTransition } from "react";
import { chargerFragmentServeur, FragmentServeur } from "@/app/actions";

const FragmentDynamique = () => {
    const [fragment, setFragment] = useState<FragmentServeur | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(async () => {
            const resultat = await chargerFragmentServeur();
            setFragment(resultat);
        });
    };

    return (
        <section className="zone-client">
            <h2>Exemple d&apos;aller-retour client / serveur</h2>
            <p>
                Le clic déclenche une Server Function : le serveur calcule les
                données et les renvoie au client sous forme de JSON. Le 
                composant client intègre ces données dans le fragment dynamique 
                ci-dessous, sans recharger la page (phase de réconciliation).
            </p>
            <button className="btn-client" onClick={handleClick} disabled={isPending}>
                {isPending ? "Chargement..." : "Charger un fragment depuis le serveur"}
            </button>
            {fragment && (
                <div className="fragment-resultat">
                    <p>Données générées par le serveur à {fragment.genereLe}</p>
                    <p>
                        Produit tiré au sort : {fragment.produit.Libelle} -{" "}
                        {fragment.produit.Prix} €
                    </p>
                </div>
            )}
        </section>
    );
};

export default FragmentDynamique;

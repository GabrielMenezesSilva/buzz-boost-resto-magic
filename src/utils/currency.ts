export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-CH', {
        style: 'currency',
        currency: 'CHF'
    }).format(value);
};

/** Alias explicite pour la règle d'or CHF du projet DopplerDine */
export const formatCHF = formatCurrency;

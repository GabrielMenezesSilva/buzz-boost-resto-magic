export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-CH', {
        style: 'currency',
        currency: 'CHF'
    }).format(value);
};

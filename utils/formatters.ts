export const formatCurrency = (value: number, locale: string = "es-CL") => {
	return new Intl.NumberFormat(locale, {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
		// useGrouping: true,
	}).format(value);
};

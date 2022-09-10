export const cnpjMask = (value) => {
	return (
		value
			// Impede digitação de letras
			.replace(/\D+/g, "")
			// Captura dois grupos de números, com 2 e 3 dígitos; depois do primeiro grupo adiciona um ponto antes do segundo grupo
			.replace(/(\d{2})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d)/, "$1.$2")
			// Captura dois grupos de números, com 3 e 4 dígitos; depois do primeiro grupo adiciona uma barra antes do segundo grupo
			.replace(/(\d{3})(\d)/, "$1/$2")
			.replace(/(\d{4})(\d)/, "$1-$2")
			// Captura os dois últimos números, com um hífen (-) antes dos dois números
			.replace(/(-\d{2})\d+?$/, "$1")
	);
};

export const numberMask = (value) => {
	return (
		value
			// Impede digitação de letras
			.replace(/\D+/g, "")
			// Bloqueia a digitação em até 6 números
			.replace(/(\d{6})(\d)/, "$1")
	);
};

export const cepMask = (value) => {
	return value
		.replace(/\D/g, "")
		.replace(/(\d{5})(\d)/, "$1-$2")
		.replace(/(-\d{3})\d+?$/, "$1");
};

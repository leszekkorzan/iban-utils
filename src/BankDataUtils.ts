export type CountryCode = "PL";

type PLDataType = {
	data_release: string;
	data_version: string;
	data: PLBankType[];
};

type PLBankType = {
	type: string;
	id: string;
	name: string;
	symbol: null | string;
	registration_date: string;
	trading_names: string[] | null | string;
	registry_number: null | string;
	LEI_id: null | string;
	GIIN_id: null | string;
	nip: null | string;
	website: null | string;
	BIN_id: string[] | null | string;
	branches: PLBranch[];
};

type PLBranch = {
	evidence_id: string;
	type: string;
	name: string;
	symbol: string;
	registrationDate: null | string;
	phone: Array<null | string> | null | string;
	address: PLAddress;
	bank_number_data: PLBankNumberData[];
};

type PLAddress = {
	country: string;
	state: null | string;
	district: null | string;
	city: string;
	postal_code: null | string;
	street: string;
	building: null | string;
};

type PLBankNumberData = {
	number: string;
	name: null | string;
	bic_codes: string[] | null | string;
	generation_date: string;
};

export type FaviconConfig = {
	provider: "google";
	defaultGoogleFaviconSize: number;
} | {
	provider: "duckduckgo";
};

const IBAN_LENGTHS = {
	AD: 24,
	AE: 23,
	AT: 20,
	AZ: 28,
	BA: 20,
	BE: 16,
	BG: 22,
	BH: 22,
	BR: 29,
	CH: 21,
	CY: 28,
	CZ: 24,
	DE: 22,
	DK: 18,
	DO: 28,
	EE: 20,
	ES: 24,
	FI: 18,
	FO: 18,
	FR: 27,
	GB: 22,
	GI: 23,
	GL: 18,
	GR: 27,
	GT: 28,
	HR: 21,
	HU: 28,
	IE: 22,
	IL: 23,
	IS: 26,
	IT: 27,
	JO: 30,
	KW: 30,
	KZ: 20,
	LB: 28,
	LI: 21,
	LT: 20,
	LU: 20,
	LV: 21,
	MC: 27,
	MD: 24,
	ME: 22,
	MK: 19,
	MR: 27,
	MT: 31,
	MU: 30,
	NL: 18,
	NO: 15,
	PK: 24,
	PL: 28,
	PS: 29,
	PT: 25,
	QA: 29,
	RO: 24,
	RS: 22,
	SA: 24,
	SE: 24,
	SI: 19,
	SK: 24,
	SM: 27,
	TN: 24,
	TR: 26,
	AL: 28,
	BY: 28,
	CR: 22,
	EG: 29,
	GE: 22,
	IQ: 23,
	LC: 32,
	SC: 31,
	ST: 25,
	SV: 28,
	TL: 23,
	UA: 29,
	VA: 22,
	VG: 24,
	XK: 20,
};

export default class BankDataUtils {
	defaultCountryCode?: keyof typeof IBAN_LENGTHS;
	faviconConfig?: FaviconConfig = {
		provider: 'google',
		defaultGoogleFaviconSize: 128
	};

	constructor(defaultCountryCode?: keyof typeof IBAN_LENGTHS, faviconConfig?: FaviconConfig) {
		this.defaultCountryCode = defaultCountryCode;
		if(faviconConfig){
			this.faviconConfig = faviconConfig
		}
	}

	private constructFaviconUrl(website: string) {
		switch (this.faviconConfig?.provider) {
			case 'google':
				return `https://www.google.com/s2/favicons?domain=${website}&sz=${this.faviconConfig.defaultGoogleFaviconSize}`
			case 'duckduckgo':
				return `https://icons.duckduckgo.com/ip3/${website}.ico`
			default:
				return null
		}
	}

	private getPLBankAndBranchData(bic: string) {
		const data: PLDataType = require("./data/pl.json");

		for (const bank of data.data) {
			for (const branch of bank.branches) {
				for (const bankNumberData of branch.bank_number_data) {
					if (bankNumberData.number === bic) {
						return {
							sourceInfo: {
								data_release: data.data_release,
								data_version: data.data_version,
							},
							...bank,
							faviconUrl: bank.website ? this.constructFaviconUrl(bank.website) : null,
							branches: null,
							branch: {
								...branch,
								bank_number_data: bankNumberData,
							},
						};
					}
				}
			}
		}
		return null;
	}

	private getBankAndBranchData(countryCode: CountryCode, bic: string) {
		switch (countryCode) {
			case "PL":
				return this.getPLBankAndBranchData(bic);
			default:
				return null;
		}
	}

	private mod97(ibanString: string) {
		let remainder = "";
		for (let i = 0; i < ibanString.length; i += 7) {
			remainder = String(
				Number.parseInt(remainder + ibanString.slice(i, i + 7), 10) % 97,
			);
		}
		return Number.parseInt(remainder, 10);
	}

	validateIBAN(iban: string) {
		const cleanIBAN = iban.replace(/\s+/g, "").toUpperCase();
		const countryCode = cleanIBAN.slice(0, 2);

		if (!IBAN_LENGTHS[countryCode as keyof typeof IBAN_LENGTHS]) {
			return { valid: false };
		}

		const rearrangedIBAN = cleanIBAN.slice(4) + cleanIBAN.slice(0, 4);

		const numericIBAN = rearrangedIBAN
			.split("")
			.map((char) => {
				return /[A-Z]/.test(char) ? char.charCodeAt(0) - 55 : char;
			})
			.join("");

		const ibanChecksum = this.mod97(numericIBAN);

		if (ibanChecksum !== 1) {
			return { valid: false };
		}

		const checkDigits = cleanIBAN.slice(2, 4);
		const bban = cleanIBAN.slice(4);

		const bic = bban.slice(0, 8);

		return {
			valid: true,
			countryCode: countryCode,
			checkDigits: checkDigits,
			bban: bban,
			bic: bic,
		};
	}

	getBankDataFromIBAN(iban: string) {
		const preparedIban =
			this.defaultCountryCode && !/^[A-Za-z]{2}/.test(iban)
				? `${this.defaultCountryCode}${iban}`
				: iban;

		const validation = this.validateIBAN(preparedIban);
		if (validation.valid) {
			return {
				...validation,
				bank: this.getBankAndBranchData(
					validation.countryCode as CountryCode,
					validation.bic as string,
				),
			};
		}
		return {
			...validation,
			bank: null,
		};
	}
}

import BankDataUtils from "./BankDataUtils";
import type { CountryCode, FaviconConfig } from "./BankDataUtils";

export function getBankDataFromIBAN(
	iban: string,
	defaultCountryCode?: CountryCode,
	faviconConfig?: FaviconConfig,
) {
	const utils = new BankDataUtils(defaultCountryCode, faviconConfig);
	const response = utils.getBankDataFromIBAN(iban);
	return response;
}

import { getBankDataFromIBAN } from "./utils";

test('valid bank account', () => {
    expect(getBankDataFromIBAN('PL67109024028933299287615598').valid).toBe(true);
})

test('valid formatted bank account', () => {
    expect(getBankDataFromIBAN('PL 67 1090 2402 8933 2992 8761 5598').valid).toBe(true);
})

test('valid bank account with default country code [PL]', () => {
    expect(getBankDataFromIBAN('67109024028933299287615598', 'PL').valid).toBe(true);
})

test('test bank account country code [PL]', () => {
    expect(getBankDataFromIBAN('PL67109024028933299287615598').countryCode).toBe('PL');
})

test('invalid bank account', () => {
    expect(getBankDataFromIBAN('6271090240289252133299287615598').valid).toBe(false);
})

test('invalid bank account checksum', () => {
    expect(getBankDataFromIBAN('PL 00 0000 0000 0000 0000 0000 0000').valid).toBe(false);
})

test('test bank registry_number [PL]', () => {
    expect(getBankDataFromIBAN('PL67109024028933299287615598').bank?.registry_number).toBe('0000008723');
})

test('test bank branch evidence_id [PL]', () => {
    expect(getBankDataFromIBAN('PL67109024028933299287615598').bank?.branch.evidence_id).toBe('A001342');
})

test('test bank without branch info', () => {
    const res = getBankDataFromIBAN('NL03RABO9248708374')
    expect(res.valid).toBe(true);
    expect(res.bank).toBe(null)
})
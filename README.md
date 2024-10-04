<div align="center">
  <h1>iban-utils</h1>
  Validate IBAN numbers and extract detailed bank and branch information - even bank logo! Supports global IBAN validation and currently extracts data for Polish IBANs.
</div>

<div align="center">
<br />

[![Project license](https://img.shields.io/npm/l/iban-utils?style=flat-square)](LICENSE)
![Project version](https://img.shields.io/npm/v/iban-utils?style=flat-square&color=blue)
![Dependencies](https://img.shields.io/badge/Dependencies-0-green?style=flat-square)
![Stage](https://img.shields.io/badge/BETA-orange?style=flat-square)

</div>

<details open="open">
<summary>Table of Contents</summary>

- [About](#about)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [License](#license)

</details>

---

## About

> iban-utils is **zero dependency** a Node.js package designed to validate IBANs (International Bank Account Number). The package not only verifies the correctness of IBAN numbers but also allows you to extract detailed information about the bank and branch for supported countries (currently Polish IBANs). This can be particularly useful for handling payments, verifying account information, and ensuring financial data integrity in your applications.

> Whether you are developing financial apps, payment gateways, or banking software, this package simplifies the validation and extraction process, making it a must-have for any developer dealing with IBANs. Additional country support for data extraction will be added in future releases.

### Bank data and branch extraction availability

**country**|**is supported**|**source**
:-----:|:-----:|:-----:
Poland (PL)|🟢 YES|EWIB 2.0

### Built With

> Pure JS combined with a python for generating bank data sets. 


## Getting Started

### Prerequisites

> \>= ES2015 node

### Installation

```npm i iban-utils```

## Usage

Example:
```js
import { getBankDataFromIBAN } from "iban-utils"

const response = getBankDataFromIBAN('PL67109024028933299287615598')

console.log(response)
```

Response:
```js
{
  valid: true,
  countryCode: 'PL',
  checkDigits: '67',
  bban: '109024028933299287615598',
  bic: '10902402',
  bank: {
    sourceInfo: { data_release: '2024-09-27', data_version: 'PL/ewib/Pub.wer.418' },
    type: 'bank krajowy',
    id: '109',
    name: 'Santander Bank Polska Spółka Akcyjna',
    symbol: 'SANPL',
    registration_date: '1989-01-01',
    trading_names: null,
    registry_number: '0000008723',
    LEI_id: '259400LGXW3K0GDAG361',
    GIIN_id: 'B64D0N.00500.ME.616',
    nip: '8960005673',
    website: 'www.santander.pl',
    BIN_id: [
      'BIN VISA 401325,402358,410830,415045,415048,417223,420546,421588,424479,426846,428359,432068,433802,440547,448351,473706,477915,479080,479084,485723,485724,487489,412281,421636,423725,426847,427755,465557,479080,479084,485723,485724,410830,419491,429566,438371,440586,451480,483047,421352,419172,419173',
      'BIN MasterCard 516827,516828,525632,534160,536388,536412,545380,545580,547605,547607,552044,518682,519308,522368,528176,528577,533908,536360,539669,542517,545250,545258,547303,548600,548606,552626,557386,557509,557519,557716,558467'
    ],
    branches: null,
    faviconUrl: 'https://www.google.com/s2/favicons?domain=www.santander.pl&sz=128',
    branch: {
      evidence_id: 'A001342',
      type: 'Oddział',
      name: '1 Oddział we Wrocławiu',
      symbol: 'O.',
      registrationDate: '2001-10-22',
      phone: [ '71 370 14 03', '71 370 14 05' ],
      address: {
        country: 'POLSKA',
        state: 'DOLNOŚLĄSKIE',
        district: 'Wrocław',
        city: 'Wrocław',
        postal_code: '50-950',
        street: 'Rynek',
        building: '9/11'
      },
      bank_number_data: {
        number: '10902402',
        name: '2 Oddział we Wrocławiu',
        bic_codes: [ 'BIC WBKPPLPPXXX', 'BIC SEPA WBKPPLPPXXX' ],
        generation_date: '2001-10-22'
      }
    }
  }
}

```

## Roadmap

> Working on ...

## License

This project is licensed under the **MIT license**.

See [LICENSE](LICENSE) for more information.
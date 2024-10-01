
import xmltodict 
import json

with open('parser/plewiba.xml', 'r') as file: 
    my_xml = file.read() 
  
releaseDateInput = input('Data release date: ')
releaseVersionInput = input('Data version: ')
 
my_dict = xmltodict.parse(my_xml)

prepared = []


orgs = my_dict.get('Instytucje').get('Instytucja')

for org in orgs:
    org_data = {
        'type': org['TypInstytucji'],
        'id': org['NrInstytucji'],
        'name': org['NazwaInstytucji'],
        'symbol': org.get('SymbolLiterowy'),
        'registration_date': org.get('DataRozpDzial'),
        'trading_names': org.get('NazwaHandlowa'),
        'registry_number': org.get('NrWpisuRejestr'),
        'LEI_id': org.get('IdentyfikatorLEI'),
        'GIIN_id': org.get('NumerGIIN'),
        'nip': org.get('NIP'),
        'website': org.get('WWW'),
        'BIN_id': org.get('BIN'),
        'branches': []
    }
    
    branches = org.get('Jednostka')
    if(type(branches) is not list):
        branches = list([branches])
    
    preparedBranches = []
    
    for branch in branches:
        print()
        branch_data = {
            'evidence_id': branch['NrEwidencyjny'],
            'type': branch['TypJednostki'],
            'name': branch['NazwaJednostki'],
            'symbol': branch.get('SymbolLiterowy'),
            'registrationDate': branch.get('DataPodjeciaDzialalnosci'),
            'phone': branch.get('NumerTelefonu'),
            'address': {
                'country': branch.get('DaneAdresowe').get('kraj'),
                'state': branch.get('DaneAdresowe').get('wojewodztwo'),
                'district': branch.get('DaneAdresowe').get('powiat'),
                'city': branch.get('DaneAdresowe').get('miejscowosc'),
                'postal_code': branch.get('DaneAdresowe').get('kodPocztowy'),
                'street': branch.get('DaneAdresowe').get('ulica'),
                'building': branch.get('DaneAdresowe').get('numerBudynku')
            },
            'bank_number_data': []
        }

        bankNumbers = branch.get('NumerRozliczeniowy')

        if(bankNumbers):
            if(type(bankNumbers) is not list):
                bankNumbers = list([bankNumbers])

            bank_number_data = []
            
            for bankNumber in bankNumbers:
                bank_number_data.append({
                    'number': bankNumber['NrRozliczeniowy'],
                    'name': bankNumber.get('NazwaNumeru'),
                    'bic_codes': bankNumber.get('KodyBIC'),
                    'generation_date': bankNumber['DataWygenerowania']
                })
            branch_data['bank_number_data'] = bank_number_data

        preparedBranches.append(branch_data)

    org_data['branches'] = preparedBranches

    prepared.append(org_data)


preparedWithVersion = {
    'data_release': releaseDateInput,
    'data_version': f"PL/ewib/{releaseVersionInput}",
    'data': prepared
}

conversion = json.dumps(preparedWithVersion, indent=2, ensure_ascii=False)

with open('src/data/pl.json', mode='w', encoding='utf-8') as json_file:
    json_file.write(conversion)
    json_file.close()
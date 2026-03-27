/**
 * 加拿大省/地区 + 主要城市级联数据
 * 
 * 用于联系表单和询价表单的省/市级联下拉菜单
 * 包含 10 个省 + 3 个地区，每个下辖主要城市
 */

export interface Province {
  code: string;       // 省份代码（ISO 3166-2:CA）
  name: string;       // 英文名
  nameFr: string;     // 法文名
  cities: string[];   // 主要城市列表
}

export const provinces: Province[] = [
  {
    code: 'AB',
    name: 'Alberta',
    nameFr: 'Alberta',
    cities: [
      'Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'St. Albert',
      'Medicine Hat', 'Grande Prairie', 'Airdrie', 'Spruce Grove', 'Leduc',
      'Fort McMurray', 'Cochrane', 'Lloydminster', 'Camrose', 'Brooks',
    ],
  },
  {
    code: 'BC',
    name: 'British Columbia',
    nameFr: 'Colombie-Britannique',
    cities: [
      'Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond',
      'Kelowna', 'Abbotsford', 'Kamloops', 'Nanaimo', 'Prince George',
      'Chilliwack', 'Vernon', 'Courtenay', 'Penticton', 'Campbell River',
      'Cranbrook', 'Fort St. John', 'Terrace',
    ],
  },
  {
    code: 'MB',
    name: 'Manitoba',
    nameFr: 'Manitoba',
    cities: [
      'Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie',
      'Selkirk', 'Winkler', 'Dauphin', 'Morden', 'The Pas',
    ],
  },
  {
    code: 'NB',
    name: 'New Brunswick',
    nameFr: 'Nouveau-Brunswick',
    cities: [
      'Moncton', 'Saint John', 'Fredericton', 'Dieppe', 'Miramichi',
      'Edmundston', 'Bathurst', 'Campbellton', 'Oromocto', 'Riverview',
    ],
  },
  {
    code: 'NL',
    name: 'Newfoundland and Labrador',
    nameFr: 'Terre-Neuve-et-Labrador',
    cities: [
      "St. John's", 'Mount Pearl', 'Corner Brook', 'Conception Bay South',
      'Paradise', 'Grand Falls-Windsor', 'Gander', 'Happy Valley-Goose Bay',
      'Labrador City', 'Stephenville',
    ],
  },
  {
    code: 'NS',
    name: 'Nova Scotia',
    nameFr: 'Nouvelle-Écosse',
    cities: [
      'Halifax', 'Dartmouth', 'Sydney', 'Truro', 'New Glasgow',
      'Glace Bay', 'Kentville', 'Amherst', 'Bridgewater', 'Yarmouth',
    ],
  },
  {
    code: 'ON',
    name: 'Ontario',
    nameFr: 'Ontario',
    cities: [
      'Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton',
      'London', 'Markham', 'Vaughan', 'Kitchener', 'Windsor',
      'Richmond Hill', 'Oakville', 'Burlington', 'Oshawa', 'Whitby',
      'Ajax', 'Pickering', 'Barrie', 'Sudbury', 'St. Catharines',
      'Guelph', 'Cambridge', 'Waterloo', 'Kingston', 'Thunder Bay',
      'Chatham-Kent', 'Brantford', 'Sarnia', 'Peterborough', 'Sault Ste. Marie',
      'Timmins', 'North Bay', 'Kenora', 'Dryden',
    ],
  },
  {
    code: 'PE',
    name: 'Prince Edward Island',
    nameFr: 'Île-du-Prince-Édouard',
    cities: [
      'Charlottetown', 'Summerside', 'Stratford', 'Cornwall', 'Montague',
    ],
  },
  {
    code: 'QC',
    name: 'Quebec',
    nameFr: 'Québec',
    cities: [
      'Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil',
      'Sherbrooke', 'Lévis', 'Saguenay', 'Trois-Rivières', 'Terrebonne',
      'Saint-Jean-sur-Richelieu', 'Repentigny', 'Drummondville', 'Brossard',
      'Saint-Jérôme', 'Granby', 'Blainville', 'Shawinigan', 'Dollard-des-Ormeaux',
      'Rimouski', 'Victoriaville', 'Val-d\'Or', 'Rouyn-Noranda', 'Sept-Îles',
      'Alma', 'Baie-Comeau',
    ],
  },
  {
    code: 'SK',
    name: 'Saskatchewan',
    nameFr: 'Saskatchewan',
    cities: [
      'Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current',
      'Yorkton', 'North Battleford', 'Estevan', 'Weyburn', 'Lloydminster',
    ],
  },
  {
    code: 'NT',
    name: 'Northwest Territories',
    nameFr: 'Territoires du Nord-Ouest',
    cities: [
      'Yellowknife', 'Hay River', 'Inuvik', 'Fort Smith', 'Behchoko',
    ],
  },
  {
    code: 'NU',
    name: 'Nunavut',
    nameFr: 'Nunavut',
    cities: [
      'Iqaluit', 'Rankin Inlet', 'Arviat', 'Baker Lake', 'Cambridge Bay',
    ],
  },
  {
    code: 'YT',
    name: 'Yukon',
    nameFr: 'Yukon',
    cities: [
      'Whitehorse', 'Dawson City', 'Watson Lake', 'Haines Junction', 'Carmacks',
    ],
  },
];

/**
 * 根据省份代码获取城市列表
 */
export function getCitiesByProvince(code: string): string[] {
  const province = provinces.find((p) => p.code === code);
  return province?.cities ?? [];
}

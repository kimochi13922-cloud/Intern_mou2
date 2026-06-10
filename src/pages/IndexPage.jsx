import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSql, useActivity } from '../sql_connect';


const IndexPage = () => {
  const { sqlData, loading: sqlLoading, refreshData } = useSql();
  const { activityData, activityLoading, refreshActivities } = useActivity();
  
  const loading = sqlLoading || activityLoading;
  const [mapError, setMapError] = useState(null);
  
  const handleRefresh = () => {
    refreshData();
    refreshActivities();
  };
  
  // Calculate statistics
  const safeSqlData = React.useMemo(() => Array.isArray(sqlData) ? sqlData : [], [sqlData]);
  const totalMOU = safeSqlData.length;
  const uniqueInstitutions = new Set(safeSqlData.map(item => item.institution).filter(Boolean)).size;
  
  const safeActivityData = Array.isArray(activityData) ? activityData : [];
  const totalActivities = safeActivityData.length;

  const { nationCounts, topCountries } = React.useMemo(() => {
    // Map common Thai/English names to ISO 2-letter codes for Highcharts
    const map = {
      'ไทย': 'th', 'ประเทศไทย': 'th',
      'usa': 'us', 'สหรัฐอเมริกา': 'us', 'สหรัฐ': 'us',
      'ญี่ปุ่น': 'jp', 'ประเทศญี่ปุ่น': 'jp',
      'จีน': 'cn', 'ประเทศจีน': 'cn',
      'ออสเตรเลีย': 'au', 'ประเทศออสเตรเลีย': 'au',
      'ออสเตรีย': 'at', 'ประเทศออสเตรีย': 'at',
      'uk': 'gb', 'england': 'gb', 'อังกฤษ': 'gb', 'ประเทศอังกฤษ': 'gb', 'สหราชอาณาจักร': 'gb',
      'ฝรั่งเศส': 'fr', 'ประเทศฝรั่งเศส': 'fr',
      'เยอรมนี': 'de', 'เยอรมัน': 'de', 'ประเทศเยอรมนี': 'de',
      'korea': 'kr', 'เกาหลีใต้': 'kr', 'ประเทศเกาหลีใต้': 'kr',
      'ไต้หวัน': 'tw', 'ประเทศไต้หวัน': 'tw',
      'สิงคโปร์': 'sg', 'ประเทศสิงคโปร์': 'sg',
      'มาเลเซีย': 'my', 'ประเทศมาเลเซีย': 'my',
      'เวียดนาม': 'vn', 'ประเทศเวียดนาม': 'vn',
      'อินโดนีเซีย': 'id', 'ประเทศอินโดนีเซีย': 'id',
      'ฟิลิปปินส์': 'ph', 'ประเทศฟิลิปปินส์': 'ph',
      'อินเดีย': 'in', 'ประเทศอินเดีย': 'in',
      'นิวซีแลนด์': 'nz', 'ประเทศนิวซีแลนด์': 'nz',
      'แคนาดา': 'ca', 'ประเทศแคนาดา': 'ca',
      'กัมพูชา': 'kh', 'เนเธอร์แลนด์': 'nl', 'บรูไน': 'bn',
      'พม่า': 'mm', 'เมียนมา': 'mm', 'รัสเซีย': 'ru', 'ลาว': 'la',
      'สเปน': 'es', 'สวิตเซอร์แลนด์': 'ch', 'สวีเดน': 'se',
      'อิตาลี': 'it', 'อัฟกานิสถาน': 'af', 'แอลเบเนีย': 'al', 'แอลจีเรีย': 'dz', 
      'อันดอร์รา': 'ad', 'แองโกลา': 'ao', 'แอนติกาและบาร์บูดา': 'ag', 'อาร์เจนตินา': 'ar', 
      'อาร์เมเนีย': 'am', 'อาเซอร์ไบจาน': 'az', 'บาฮามาส': 'bs', 'บาห์เรน': 'bh', 
      'บังกลาเทศ': 'bd', 'บาร์เบโดส': 'bb', 'เบลารุส': 'by', 'เบลเยียม': 'be', 
      'เบลีซ': 'bz', 'เบนิน': 'bj', 'ภูฏาน': 'bt', 'โบลิเวีย': 'bo', 
      'บอสเนียและเฮอร์เซโกวีนา': 'ba', 'บอตสวานา': 'bw', 'บราซิล': 'br', 
      'บัลแกเรีย': 'bg', 'บูร์กินาฟาโซ': 'bf', 'บุรุนดี': 'bi', 'แคเมอรูน': 'cm', 
      'เคปเวิร์ด': 'cv', 'แอฟริกากลาง': 'cf', 'ชาด': 'td', 'ชิลี': 'cl', 
      'โคลอมเบีย': 'co', 'คอโมโรส': 'km', 'คองโก': 'cg', 'คอสตาริกา': 'cr', 
      'โครเอเชีย': 'hr', 'คิวบา': 'cu', 'ไซปรัส': 'cy', 'เช็กเกีย': 'cz', 'เช็ก': 'cz', 
      'เดนมาร์ก': 'dk', 'จิบูตี': 'dj', 'ดอมินิกา': 'dm', 'โดมินิกัน': 'do', 
      'ติมอร์-เลสเต': 'tl', 'เอกวาดอร์': 'ec', 'อียิปต์': 'eg', 'เอลซัลวาดอร์': 'sv', 
      'อิเควทอเรียลกินี': 'gq', 'เอริเทรีย': 'er', 'เอสโตเนีย': 'ee', 'เอสวาตินี': 'sz', 
      'เอธิโอเปีย': 'et', 'ฟิจิ': 'fj', 'ฟินแลนด์': 'fi', 'กาบอง': 'ga', 
      'แกมเบีย': 'gm', 'จอร์เจีย': 'ge', 'กานา': 'gh', 'กรีซ': 'gr', 
      'กรีเนดา': 'gd', 'กัวเตมาลา': 'gt', 'กินี': 'gn', 'กินี-บิสเซา': 'gw', 
      'กายอานา': 'gy', 'เฮติ': 'ht', 'ฮอนดูรัส': 'hn', 'ฮังการี': 'hu', 
      'ไอซ์แลนด์': 'is', 'อิหร่าน': 'ir', 'อิรัก': 'iq', 'ไอร์แลนด์': 'ie', 
      'อิสราเอล': 'il', 'จาเมกา': 'jm', 'จอร์แดน': 'jo', 'คาซัคสถาน': 'kz', 
      'เคนยา': 'ke', 'คิริบาส': 'ki', 'เกาหลีเหนือ': 'kp', 'คูเวต': 'kw', 
      'คีร์กีซสถาน': 'kg', 'ลัตเวีย': 'lv', 'เลบานอน': 'lb', 'เลโซโท': 'ls', 
      'ไลบีเรีย': 'lr', 'ลิเบีย': 'ly', 'ลิกเตนสไตน์': 'li', 'ลิทัวเนีย': 'lt', 
      'ลักเซมเบิร์ก': 'lu', 'มาดากัสการ์': 'mg', 'มาลาวี': 'mw', 'มัลดีฟส์': 'mv', 
      'มาลี': 'ml', 'มอลตา': 'mt', 'หมู่เกาะมาร์แชลล์': 'mh', 'มอริเตเนีย': 'mr', 
      'มอริเชียส': 'mu', 'เม็กซิโก': 'mx', 'ไมโครนีเซีย': 'fm', 'มอลโดวา': 'md', 
      'โมนาโก': 'mc', 'มองโกเลีย': 'mn', 'มอนเตเนโกร': 'me', 'โมร็อกโก': 'ma', 
      'โมซัมบิก': 'mz', 'นามิเบีย': 'na', 'นาอูรู': 'nr', 'เนปาล': 'np', 
      'นิการากัว': 'ni', 'ไนเจอร์': 'ne', 'ไนจีเรีย': 'ng', 'มาซิโดเนียเหนือ': 'mk', 
      'นอร์เวย์': 'no', 'โอมาน': 'om', 'ปากีสถาน': 'pk', 'ปาเลา': 'pw', 
      'ปานามา': 'pa', 'ปาปัวนิวกินี': 'pg', 'ปารากวัย': 'py', 'เปรู': 'pe', 
      'โปแลนด์': 'pl', 'โปรตุเกส': 'pt', 'กาตาร์': 'qa', 'โรมาเนีย': 'ro', 
      'รวันดา': 'rw', 'เซนต์คิตส์และเนวิส': 'kn', 'เซนต์ลูเซีย': 'lc', 
      'เซนต์วินเซนต์และเกรนาดีนส์': 'vc', 'ซามัว': 'ws', 'ซานมารีโน': 'sm', 
      'เซาตูเมและปรินซิปี': 'st', 'ซาอุดีอาระเบีย': 'sa', 'เซเนกัล': 'sn', 
      'เซอร์เบีย': 'rs', 'เซเชลส์': 'sc', 'เซียร์ราลีโอน': 'sl', 'สโลวาเกีย': 'sk', 
      'สโลวีเนีย': 'si', 'หมู่เกาะโซโลมอน': 'sb', 'โซมาเลีย': 'so', 'แอฟริกาใต้': 'za', 
      'ซูดานใต้': 'ss', 'ศรีลังกา': 'lk', 'ซูดาน': 'sd', 'ซูรินาม': 'sr', 
      'ซีเรีย': 'sy', 'ทาจิกิสถาน': 'tj', 'แทนซาเนีย': 'tz', 'โตโก': 'tg', 
      'ตองกา': 'to', 'ตรินิแดดและโตเบโก': 'tt', 'ตูนิเซีย': 'tn', 'ตุรกี': 'tr', 
      'เติร์กเมนิสถาน': 'tm', 'ตูวาลู': 'tv', 'ยูกันดา': 'ug', 'ยูเครน': 'ua', 
      'สหรัฐอาหรับเอมิเรตส์': 'ae', 'อุรุกวัย': 'uy', 'อุซเบกิสถาน': 'uz', 
      'วานูอาตู': 'vu', 'นครรัฐวาติกัน': 'va', 'เวเนซุเอลา': 've', 'เยเมน': 'ye', 
      'แซมเบีย': 'zm', 'ซิมบับเว': 'zw',
      'afghanistan': 'af', 'albania': 'al', 'algeria': 'dz', 'andorra': 'ad', 
      'angola': 'ao', 'antigua and barbuda': 'ag', 'argentina': 'ar', 'armenia': 'am', 
      'australia': 'au', 'austria': 'at', 'azerbaijan': 'az', 'bahamas': 'bs', 
      'bahrain': 'bh', 'bangladesh': 'bd', 'barbados': 'bb', 'belarus': 'by', 
      'belgium': 'be', 'belize': 'bz', 'benin': 'bj', 'bhutan': 'bt', 'bolivia': 'bo', 
      'bosnia and herzegovina': 'ba', 'botswana': 'bw', 'brazil': 'br', 'brunei': 'bn', 
      'bulgaria': 'bg', 'burkina faso': 'bf', 'burundi': 'bi', 'cambodia': 'kh', 
      'cameroon': 'cm', 'canada': 'ca', 'cape verde': 'cv', 'central african republic': 'cf', 
      'chad': 'td', 'chile': 'cl', 'china': 'cn', 'colombia': 'co', 'comoros': 'km', 
      'congo': 'cg', 'costa rica': 'cr', 'croatia': 'hr', 'cuba': 'cu', 'cyprus': 'cy', 
      'czechia': 'cz', 'denmark': 'dk', 'djibouti': 'dj', 'dominica': 'dm', 
      'dominican republic': 'do', 'timor-leste': 'tl', 'ecuador': 'ec', 'egypt': 'eg', 
      'el salvador': 'sv', 'equatorial guinea': 'gq', 'eritrea': 'er', 'estonia': 'ee', 
      'eswatini': 'sz', 'ethiopia': 'et', 'fiji': 'fj', 'finland': 'fi', 'france': 'fr', 
      'gabon': 'ga', 'gambia': 'gm', 'georgia': 'ge', 'germany': 'de', 'ghana': 'gh', 
      'greece': 'gr', 'grenada': 'gd', 'guatemala': 'gt', 'guinea': 'gn', 
      'guinea-bissau': 'gw', 'guyana': 'gy', 'haiti': 'ht', 'honduras': 'hn', 
      'hungary': 'hu', 'iceland': 'is', 'india': 'in', 'indonesia': 'id', 'iran': 'ir', 
      'iraq': 'iq', 'ireland': 'ie', 'israel': 'il', 'italy': 'it', 'jamaica': 'jm', 
      'japan': 'jp', 'jordan': 'jo', 'kazakhstan': 'kz', 'kenya': 'ke', 'kiribati': 'ki', 
      'north korea': 'kp', 'south korea': 'kr', 'kuwait': 'kw', 'kyrgyzstan': 'kg', 
      'laos': 'la', 'latvia': 'lv', 'lebanon': 'lb', 'lesotho': 'ls', 'liberia': 'lr', 
      'libya': 'ly', 'liechtenstein': 'li', 'lithuania': 'lt', 'luxembourg': 'lu', 
      'madagascar': 'mg', 'malawi': 'mw', 'malaysia': 'my', 'maldives': 'mv', 
      'mali': 'ml', 'malta': 'mt', 'marshall islands': 'mh', 'mauritania': 'mr', 
      'mauritius': 'mu', 'mexico': 'mx', 'micronesia': 'fm', 'moldova': 'md', 
      'monaco': 'mc', 'mongolia': 'mn', 'montenegro': 'me', 'morocco': 'ma', 
      'mozambique': 'mz', 'myanmar': 'mm', 'namibia': 'na', 'nauru': 'nr', 
      'nepal': 'np', 'netherlands': 'nl', 'new zealand': 'nz', 'nicaragua': 'ni', 
      'niger': 'ne', 'nigeria': 'ng', 'north macedonia': 'mk', 'norway': 'no', 
      'oman': 'om', 'pakistan': 'pk', 'palau': 'pw', 'panama': 'pa', 
      'papua new guinea': 'pg', 'paraguay': 'py', 'peru': 'pe', 'philippines': 'ph', 
      'poland': 'pl', 'portugal': 'pt', 'qatar': 'qa', 'romania': 'ro', 'russia': 'ru', 
      'rwanda': 'rw', 'saint kitts and nevis': 'kn', 'saint lucia': 'lc', 
      'saint vincent and the grenadines': 'vc', 'samoa': 'ws', 'san marino': 'sm', 
      'sao tome and principe': 'st', 'saudi arabia': 'sa', 'senegal': 'sn', 
      'serbia': 'rs', 'seychelles': 'sc', 'sierra leone': 'sl', 'singapore': 'sg', 
      'slovakia': 'sk', 'slovenia': 'si', 'solomon islands': 'sb', 'somalia': 'so', 
      'south africa': 'za', 'south sudan': 'ss', 'spain': 'es', 'sri lanka': 'lk', 
      'sudan': 'sd', 'suriname': 'sr', 'sweden': 'se', 'switzerland': 'ch', 
      'syria': 'sy', 'taiwan': 'tw', 'tajikistan': 'tj', 'tanzania': 'tz', 
      'thailand': 'th', 'togo': 'tg', 'tonga': 'to', 'trinidad and tobago': 'tt', 
      'tunisia': 'tn', 'turkey': 'tr', 'turkmenistan': 'tm', 'tuvalu': 'tv', 
      'uganda': 'ug', 'ukraine': 'ua', 'united arab emirates': 'ae', 
      'united kingdom': 'gb', 'united states': 'us', 'uruguay': 'uy', 
      'uzbekistan': 'uz', 'vanuatu': 'vu', 'vatican city': 'va', 'venezuela': 've', 
      'vietnam': 'vn', 'yemen': 'ye', 'zambia': 'zm', 'zimbabwe': 'zw'
    };

    const codeToNameTh = {
      'af': 'อัฟกานิสถาน', 'al': 'แอลเบเนีย', 'dz': 'แอลจีเรีย', 'ad': 'อันดอร์รา',
      'ao': 'แองโกลา', 'ag': 'แอนติกาและบาร์บูดา', 'ar': 'อาร์เจนตินา', 'am': 'อาร์เมเนีย',
      'au': 'ออสเตรเลีย', 'at': 'ออสเตรีย', 'az': 'อาเซอร์ไบจาน', 'bs': 'บาฮามาส',
      'bh': 'บาห์เรน', 'bd': 'บังกลาเทศ', 'bb': 'บาร์เบโดส', 'by': 'เบลารุส',
      'be': 'เบลเยียม', 'bz': 'เบลีซ', 'bj': 'เบนิน', 'bt': 'ภูฏาน', 'bo': 'โบลิเวีย',
      'ba': 'บอสเนียและเฮอร์เซโกวีนา', 'bw': 'บอตสวานา', 'br': 'บราซิล', 'bn': 'บรูไน',
      'bg': 'บัลแกเรีย', 'bf': 'บูร์กินาฟาโซ', 'bi': 'บุรุนดี', 'kh': 'กัมพูชา',
      'cm': 'แคเมอรูน', 'ca': 'แคนาดา', 'cv': 'เคปเวิร์ด', 'cf': 'แอฟริกากลาง',
      'td': 'ชาด', 'cl': 'ชิลี', 'cn': 'จีน', 'co': 'โคลอมเบีย', 'km': 'คอโมโรส',
      'cg': 'คองโก', 'cr': 'คอสตาริกา', 'hr': 'โครเอเชีย', 'cu': 'คิวบา', 'cy': 'ไซปรัส',
      'cz': 'เช็กเกีย', 'dk': 'เดนมาร์ก', 'dj': 'จิบูตี', 'dm': 'ดอมินิกา',
      'do': 'โดมินิกัน', 'tl': 'ติมอร์-เลสเต', 'ec': 'เอกวาดอร์', 'eg': 'อียิปต์',
      'sv': 'เอลซัลวาดอร์', 'gq': 'อิเควทอเรียลกินี', 'er': 'เอริเทรีย', 'ee': 'เอสโตเนีย',
      'sz': 'เอสวาตินี', 'et': 'เอธิโอเปีย', 'fj': 'ฟิจิ', 'fi': 'ฟินแลนด์',
      'fr': 'ฝรั่งเศส', 'ga': 'กาบอง', 'gm': 'แกมเบีย', 'ge': 'จอร์เจีย',
      'de': 'เยอรมนี', 'gh': 'กานา', 'gr': 'กรีซ', 'gd': 'กรีเนดา', 'gt': 'กัวเตมาลา',
      'gn': 'กินี', 'gw': 'กินี-บิสเซา', 'gy': 'กายอานา', 'ht': 'เฮติ',
      'hn': 'ฮอนดูรัส', 'hu': 'ฮังการี', 'is': 'ไอซ์แลนด์', 'in': 'อินเดีย',
      'id': 'อินโดนีเซีย', 'ir': 'อิหร่าน', 'iq': 'อิรัก', 'ie': 'ไอร์แลนด์',
      'il': 'อิสราเอล', 'it': 'อิตาลี', 'jm': 'จาเมกา', 'jp': 'ญี่ปุ่น', 'jo': 'จอร์แดน',
      'kz': 'คาซัคสถาน', 'ke': 'เคนยา', 'ki': 'คิริบาส', 'kp': 'เกาหลีเหนือ',
      'kr': 'เกาหลีใต้', 'kw': 'คูเวต', 'kg': 'คีร์กีซสถาน', 'la': 'ลาว',
      'lv': 'ลัตเวีย', 'lb': 'เลบานอน', 'ls': 'เลโซโท', 'lr': 'ไลบีเรีย',
      'ly': 'ลิเบีย', 'li': 'ลิกเตนสไตน์', 'lt': 'ลิทัวเนีย', 'lu': 'ลักเซมเบิร์ก',
      'mg': 'มาดากัสการ์', 'mw': 'มาลาวี', 'my': 'มาเลเซีย', 'mv': 'มัลดีฟส์',
      'ml': 'มาลี', 'mt': 'มอลตา', 'mh': 'หมู่เกาะมาร์แชลล์', 'mr': 'มอริเตเนีย',
      'mu': 'มอริเชียส', 'mx': 'เม็กซิโก', 'fm': 'ไมโครนีเซีย', 'md': 'มอลโดวา',
      'mc': 'โมนาโก', 'mn': 'มองโกเลีย', 'me': 'มอนเตเนโกร', 'ma': 'โมร็อกโก',
      'mz': 'โมซัมบิก', 'mm': 'พม่า', 'na': 'นามิเบีย', 'nr': 'นาอูรู',
      'np': 'เนปาล', 'nl': 'เนเธอร์แลนด์', 'nz': 'นิวซีแลนด์', 'ni': 'นิการากัว',
      'ne': 'ไนเจอร์', 'ng': 'ไนจีเรีย', 'mk': 'มาซิโดเนียเหนือ', 'no': 'นอร์เวย์',
      'om': 'โอมาน', 'pk': 'ปากีสถาน', 'pw': 'ปาเลา', 'pa': 'ปานามา',
      'pg': 'ปาปัวนิวกินี', 'py': 'ปารากวัย', 'pe': 'เปรู', 'ph': 'ฟิลิปปินส์',
      'pl': 'โปแลนด์', 'pt': 'โปรตุเกส', 'qa': 'กาตาร์', 'ro': 'โรมาเนีย',
      'ru': 'รัสเซีย', 'rw': 'รวันดา', 'kn': 'เซนต์คิตส์และเนวิส', 'lc': 'เซนต์ลูเซีย',
      'vc': 'เซนต์วินเซนต์และเกรนาดีนส์', 'ws': 'ซามัว', 'sm': 'ซานมารีโน',
      'st': 'เซาตูเมและปรินซิปี', 'sa': 'ซาอุดีอาระเบีย', 'sn': 'เซเนกัล',
      'rs': 'เซอร์เบีย', 'sc': 'เซเชลส์', 'sl': 'เซียร์ราลีโอน', 'sg': 'สิงคโปร์',
      'sk': 'สโลวาเกีย', 'si': 'สโลวีเนีย', 'sb': 'หมู่เกาะโซโลมอน', 'so': 'โซมาเลีย',
      'za': 'แอฟริกาใต้', 'ss': 'ซูดานใต้', 'es': 'สเปน', 'lk': 'ศรีลังกา',
      'sd': 'ซูดาน', 'sr': 'ซูรินาม', 'se': 'สวีเดน', 'ch': 'สวิตเซอร์แลนด์',
      'sy': 'ซีเรีย', 'tw': 'ไต้หวัน', 'tj': 'ทาจิกิสถาน', 'tz': 'แทนซาเนีย',
      'th': 'ไทย', 'tg': 'โตโก', 'to': 'ตองกา', 'tt': 'ตรินิแดดและโตเบโก',
      'tn': 'ตูนิเซีย', 'tr': 'ตุรกี', 'tm': 'เติร์กเมนิสถาน', 'tv': 'ตูวาลู',
      'ug': 'ยูกันดา', 'ua': 'ยูเครน', 'ae': 'สหรัฐอาหรับเอมิเรตส์', 'gb': 'สหราชอาณาจักร',
      'us': 'สหรัฐอเมริกา', 'uy': 'อุรุกวัย', 'uz': 'อุซเบกิสถาน', 'vu': 'วานูอาตู',
      'va': 'นครรัฐวาติกัน', 've': 'เวเนซุเอลา', 'vn': 'เวียดนาม', 'ye': 'เยเมน',
      'zm': 'แซมเบีย', 'zw': 'ซิมบับเว'
    };

    const counts = {};
    safeSqlData.forEach(item => {
      let nationStr = item.nation ? item.nation.trim().toLowerCase() : '';
      if (!nationStr) return;
      let code = nationStr.length === 2 ? nationStr : map[nationStr];
      if (code) {
        counts[code] = (counts[code] || 0) + 1;
      }
    });

    const tops = Object.entries(counts)
      .map(([code, count]) => ({ code, name: codeToNameTh[code] || code.toUpperCase(), count }))
      .sort((a, b) => b.count - a.count);

    return { nationCounts: counts, topCountries: tops };
  }, [safeSqlData]);

  const totalNations = topCountries.length;

  const mapRef = useRef(null);

  useEffect(() => {
    // Only run if Highcharts is loaded, we have data, and the ref is ready
    if (!window.Highcharts || loading || !mapRef.current) return;

    let chart;
    let isMounted = true;

    const seriesData = Object.entries(nationCounts).map(([code, count]) => ({
      code: code.toUpperCase(),
      value: count
    }));

    (async () => {
      try {
        const topology = await fetch('world.topo.json').then(r => {
            if (!r.ok) throw new Error("HTTP error " + r.status);
            return r.json();
        });
        
        if (!isMounted || !mapRef.current) return;

        chart = window.Highcharts.mapChart(mapRef.current, {
          chart: { map: topology },
          title: { text: 'MOU/MOA/LOI/LOA International Partners Maps' },
          accessibility: { enabled: false },
          mapNavigation: {
              enabled: true,
              buttonOptions: {
                  verticalAlign: 'bottom'
              }
          },
          colorAxis: {
              min: 1,
              minColor: '#E6F0FA',
              maxColor: '#003366'
          },
          series: [{
              data: seriesData,
              joinBy: ['iso-a2', 'code'],
              name: 'จำนวน MOU',
              states: {
                  hover: { color: '#BADA55' }
              }
          }],
          credits: { enabled: false }
        });
      } catch (err) {
        console.error("Error loading Highcharts map topology:", err);
        setMapError(err.toString());
      }
    })();

    // Cleanup function to destroy the chart when component unmounts or re-renders
    return () => {
      isMounted = false;
      if (chart) {
        chart.destroy();
      }
    };
  }, [nationCounts, loading]);

  return (
    <>
      <section className="hero-bg relative overflow-hidden py-20 md:py-28">
        {/* Decorative dots top-right */}
        <div className="dot-pattern absolute top-0 right-0 w-64 h-64 opacity-60 pointer-events-none"></div>
        {/* Decorative circle */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-indigo-100 opacity-50 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-2xl">
                    <span className="fade-up inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-5 border border-indigo-100">
                        ระบบจัดการฐานข้อมูล MOU
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 fade-up delay-1" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>
                        ระบบจัดการฐานข้อมูล <span className="text-indigo-600">MOU</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 fade-up delay-2 font-light">
                        รวบรวม จัดเก็บ และเผยแพร่ข้อมูล MOU ทั่วทั้งมหาวิทยาลัย
                    </p>
                    <div className="fade-up delay-3 flex flex-wrap gap-3">
                        <Link to="/MouPage" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                            ดู MOU ทั้งหมด
                    </Link>
                    <Link to="/add-Mou" className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-indigo-600 font-semibold px-6 py-3 rounded-xl shadow-sm border border-indigo-200 hover:border-indigo-400 transition-all duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        เพิ่ม MOU
                    </Link>
                </div>
            </div>
        </div>
      </section>

      {/* ================= STATS BAR ================= */}
      <section className="bg-white border-y border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">

                <div className="stat-card text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 fade-up">
                    <div className="text-3xl font-bold text-indigo-600">
                        {loading ? <span className="animate-pulse">...</span> : totalMOU}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 font-medium">ข้อตกลงทั้งหมด</div>
                </div>

                <div className="stat-card text-center p-6 rounded-2xl bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 fade-up delay-1">
                    <div className="text-3xl font-bold text-cyan-600">
                        {loading ? <span className="animate-pulse">...</span> : uniqueInstitutions}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 font-medium">สถาบันที่ร่วม</div>
                </div>

                <div className="stat-card text-center p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-white border border-pink-100 fade-up delay-2">
                    <div className="text-3xl font-bold text-pink-600">
                        {loading ? <span className="animate-pulse">...</span> : totalActivities}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 font-medium">กิจกรรมทั้งหมด</div>
                </div>

                <div className="stat-card text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 fade-up delay-3">
                    <div className="text-3xl font-bold text-emerald-600">
                        {loading ? <span className="animate-pulse">...</span> : totalNations}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 font-medium">ประเทศทั้งหมด</div>
                </div>

            </div>
        </div>
      </section>

      {/* ================= HIGHCHARTS MAP ================= */}
      <section className="bg-gray-50 border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-200 fade-up relative">
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium transition duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                รีโหลดข้อมูล
              </button>
              {mapError && (
                  <div className="absolute inset-0 bg-white/90 z-20 flex items-center justify-center text-red-600 font-bold p-4 text-center rounded-2xl">
                      Failed to load map data: {mapError}
                  </div>
              )}
              <div ref={mapRef} style={{ height: '500px', width: '100%' }}></div>
            </div>
            
            {/* ================= COUNTRY LIST ================= */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 fade-up delay-1 flex flex-col h-[532px]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>จำนวนตามประเทศ</h3>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded-lg">
                  {topCountries.length} ประเทศ
                </span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-3">
                  {topCountries.map((country, idx) => (
                    <div key={country.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-indigo-100 text-indigo-700">
                          {idx + 1}
                        </div>
                        <span className="font-medium text-gray-700">{country.name}</span>
                      </div>
                      <span className="font-bold text-indigo-600 bg-white px-3 py-1 rounded-lg shadow-sm border border-indigo-50">{country.count}</span>
                    </div>
                  ))}
                  {topCountries.length === 0 && !loading && (
                    <div className="text-center text-gray-500 py-8">ไม่มีข้อมูล</div>
                  )}
                  {loading && (
                    <div className="flex justify-center py-8">
                       <span className="animate-pulse text-indigo-600 font-medium">กำลังโหลด...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      



      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
            <span className="text-indigo-600 font-bold text-lg" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>ENNU MouHub</span>
            <p className="text-gray-400 text-sm">© 2569 ENNU MOUHub · ศูนย์กลางข้อตกลงคณะวิศวกรรมศาสตร์มหาวิทยาลัยนเรศวร</p>
        </div>
      </footer>
    </>
  );
};

export default IndexPage;

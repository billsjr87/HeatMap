/** SET DEBUG TO FALSE for PROD ENV **/
const debug = true;
const environment = debug ? 'qas' : 'prd';

// DateTime format config
const date_format = "en-GB";
const date_options = { year: 'numeric', month: 'short', day: '2-digit' };
const time_options = {hour:'numeric', minute:'numeric'};
const time_only_options = {hour:'2-digit', minute:'2-digit'};
const csvDelimiter = ',';

// Numbering Format
const numberFormat = {
  minDecimalDigit: 1,
  maxDecimalDigit: 1,
  region: 'en-US',
}

//SITE CONFIG
const siteConfig = {
  siteAddress : environment == 'prd'? 'https://jticorp.sharepoint.com/sites/Sales_Operation/Heatmap' : 'http://localhost/Heatmap',
  siteMainFolder : '/HeatMap',
  siteResourceFolder : {
    stylesheet: 'Resources/css',
    javascript: 'Resources/js',
    icon: 'Resources/icon',
  },
  siteDataFolder : '/Shared Documents/Data',
  squareSegmentProperty: 'Square',
  squareIdProperty: 'Square_C_1',
  squareCategoryProperty: 'Segment',
  bosnetCustCategory: 'szcategory_2',
  colorWin: '#87C498',
  colorExpand: '#96C0D6',
  colorSustain: '#FFEEBD',
  colorTactical: '#FBE3CD',
  colorNI: '#F2F2F2',
};

// MAP CONFIG
const mapConfig = {
  API_KEY : 'AIzaSyCwJHwiR7IjQotk1Lt-Kkha3bQxlYDJFNk',
  COUNTRY_BOUNDS : {
    north: 5.98,
    south: -11.37,
    west: 94.99,
    east: 141.16,
  },
  COUNTRY_CENTER : {
    // latitude: -1.129216,
    // longitude: 117.052246,
    latitude: -7.301581, 
    longitude: 112.724906,
  },
};


// DATA CONFIG
const dataSource = {
  _main: 'Data',
  _shp: {
    wpBoundary: '/SHP/Workplace/JTI Coverage 2024 - WP Boundaries Final',
    sqBoundary: '/SHP/Square',
    sqBoundaries: {
      eastern: "/Eastern.zip",
      javanusa: "/JavaNusa.zip",
      sumatera: "/Sumatera.zip",
    },
  },
  _point: {
    poiPoint: '/Point/Camel POIs.csv',
    billboardPoint: '/Point/JTI Billboard.xlsx',
    jtiPointjson: '/Point/BosnetCoverages/',
    idmPointjson: '/Point/IDMCoverages/idm_coverage.json',
  },
  _transaction: {
    bosnet: '/Transaction/BOSNET/',
    cakrawala: "/Transaction/CAKRAWALA/Summary Post Cakrawala-May'24.xlsb",
    idm: "/Transaction/IDM/idm_transaction_CAMEL.json",
  },
  _mapping: {
    jtiProduct: '/Mapping/JTI Product Mapping.xlsx',
    sobProduct: '/Mapping/List of SOB.xlsx',
  },
  _icon: {
    idmIcon: '/CamelIcon01.png',
    poiIcon: '/CamelIcon02.png',
    billboardIcon: '/marker0.png',
    jtiIcon: '/marker1.png',
  },
  _default: {
    workPlace: '044-00',
  }
}



// var serverSiteAddress = debug ? 'localhost/Route_Management/ph/': siteAddress ;
// var dataSourceMainLocation = serverSiteAddress + 'Data Sources/';
// var dataSourceCalls = dataSourceMainLocation + 'Calls/';
/* Main Folder Paths */
// var folderMasterUserBased = siteAddress + '/Shared Documents/';
// var folderMaster = 'Data Sources/';
// var folderMasterDSS = 'Bosnet_Integration/PRODDSS/';
// /* Main Folder BOSNET DSO */
// var folderRute = folderMaster + 'routes/';
// var folderCoverage = folderMaster+'coverages/';
// var folderCall = folderMaster + 'Calls/';
// var folderDO = folderMaster + 'DO/';
// var folderTM = folderMaster + 'TradePromo/';
// /* Main Folder BOSNET DSS */
// var folderCoverageDSS = folderMasterDSS + 'coverages/';
// var folderRuteDSS = folderMasterDSS + 'routes/';
// var folderCallDSS = folderMasterDSS + 'calls/';
// var folderDODSS = folderMasterDSS + 'DO/';
// var folderTMDSS = folderMasterDSS + 'TradePromo/';
// /* Data Sources from User */
// var fileDSOLoc = folderMasterUserBased + 'DSO.csv';
// var fileEmployee = folderMasterUserBased + 'Employee.csv';
// /* KML files */
// var folderKML = 'csv/KML/';
// /* Main Separator for CSV */
// var idSeparator = '_';
// var folderLogo = 'Shared Documents/Data Sources/Logo/';
// /* pageURL */
// var regionURL = '/regions.html';
// var regionURL_QA = '/qa.regions.html';
// var areaURL = '/areas.html';
// var areaURL_QA = '/qa.areas.html';
// var detailURL = '/details.html';
// var detailURL_QA = '/qa.details.html';
// /* Main Boundaries */


// /* User UPN */
// // var upn = getUserPrincipalName();
// var upn = "CSTDEDIAA@corp.jti.com";
//
// var folderMasterRouteMaster = 'Shared Documents/Route Master/';

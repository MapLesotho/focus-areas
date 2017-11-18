const tileReduce = require('tile-reduce')
const path = require('path')
const fs = require('fs')
const load = require('load-json-file')
const write = require('write-json-file')
const turf = require('@turf/turf')
const d3 = require('d3-queue');


const jsons = [
'../01_Quthing-Camptown.geojson',
'../02_Alwynskop_Quthing.geojson',
'../03_qn-outskirts.geojson',
'../04_Motsekuoa.geojson',
'../05_east_airport_maseru.geojson',
'../06_Lejone.geojson',
'../07_southern-tt.geojson',
'../08_bela_bela.geojson',
'../09_ha_moistsupelis.geojson',
'../10_nameless-1.geojson',
'../11_nameless-2.geojson',
'../12_Seate_Mokhotlong.geojson',
'../13_qn_camptown.geojson',
'../14_phamong_mohales_hoek.geojson'
]


const q = d3.queue(1);

function GetStats(geoPath, callback) {
  // Input variables
  const extent = geoPath;
  const geojson = load.sync(extent).features[0];
  const qatiles = 'merged.mbtiles'
  const days = 3
  const users = []

  // Results
  const edits = {}
  // const geojson = load.sync(extent)
  const results = turf.featureCollection([])

  const options = {
    geojson,
    zoom: 12,
    map: path.join(__dirname, 'buildings.js'),
    sources: [{name: 'qatiles', mbtiles: qatiles}],
    mapOptions: {
      days,
      extent: geojson,
      users
    }
  }
  var tcount = 0.0;

  const rd = tileReduce(options);

  rd.on('reduce', (count) => {
    tcount += count;
  })
  
  rd.on('end', () => {
    // console.log('Extent:', extent)
    // console.log('Buildings total count: %d', tcount)
    return callback(null, {file: extent, buildings: tcount});
  })  
  // return rd
};

let tasks = []

jsons.forEach(x => {
  q.defer(GetStats, x)
})

q.awaitAll(function (err, results) {
  if (err) throw new Error(err);
  // results are provided as an array
  console.log(results);
  fs.writeFile('./building-counts.json', JSON.stringify(results))
});

const turf = require('@turf/turf')

const days = global.mapOptions.days
const extent = global.mapOptions.extent
const users = global.mapOptions.users

module.exports = (data, tile, writeData, done) => {
  const features = []
  let count = 0;
  // const timestamp = Date.now() / 1000 - days * 24 * 60 * 60

  for (const feature of data.qatiles.osm.features) {
    if (feature.geometry.type === 'Polygon') {
      // Only find buildings
      if (!feature.properties.building) { continue }
      // Filter by Date
      // if (days > 0) { if (!(Number(feature.properties['@timestamp']) > timestamp)) { continue } }

      // Filter by Usernames
      // if (users.length) { if (users.indexOf(feature.properties['@user']) === -1) { continue } }
      // count +=1
      // Must intersect within extent
      try {
        turf.intersect(feature, extent) ? count +=1 : null
      } catch (e) {
        console.log('caught inner "bogus"', e);
      }
      // console.log(feature)
      // if (turf.intersect(feature, extent)) {
      //   // features.push(feature)
      //   count += 1;
      // }
    }
  }
  done(null, count)
}

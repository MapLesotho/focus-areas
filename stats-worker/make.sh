
# download and extract the tiles
wget https://s3.amazonaws.com/mapbox/osm-qa-tiles-production/latest.country/lesotho.mbtiles.gz
gunzip -c lesotho.mbtiles.gz > lesotho.mbtiles
rm lesotho.mbtiles.gz

wget https://s3.amazonaws.com/mapbox/osm-qa-tiles-production/latest.country/south_africa.mbtiles.gz
gunzip -c south_africa.mbtiles.gz > south_africa.mbtiles
rm south_africa.mbtiles.gz

# make the csv
ndjson-cat building-counts.json \
| ndjson-split \
| ndjson-map 'd.file = d.file.replace("../", ""), d' \
| json2csv -n > building-counts.csv
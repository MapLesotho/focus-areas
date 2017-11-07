for i in *.geojson; do
    # [ -f "$i" ] || break
    echo $i
    ndjson-cat < $i | ndjson-split 'd.features' >> all.ndjson
done

ndjson-reduce < all.ndjson | ndjson-map '{type: "FeatureCollection", features: d}' > 00_all.geojson
rm all.ndjson
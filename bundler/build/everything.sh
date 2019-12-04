#!/bin/sh

rm -rf bundles
mkdir -p bundles

for file in ./bundler/bundles/*.json
do
	yarn plugin $(basename $file)
	yarn bundle
done

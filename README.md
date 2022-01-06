# Mapping Earthquakes

## Project Objective
The purpose of this project is to create an earthquake map with a streets view option, a dark view option, and a Satellite view option. I also created 3 layers, one for earthquakes, one for tectonic plates and one for major earthquakes. 

### Methods Used
- Mapbox API to map single points, multiple points, map lines
- HTML page
- CSS file
- Read in GeoJSON Data to map multiple GeoJSON points, linestrings, and polygons

## Earthquake Data

### Tectonic Plate Data
I added tectonic plate data as a second layer group and an overlay object. The tectonic plate data is passed to the geoJSON layer and the geoJSON layer adds color and width to the tectonic plate lines. The tectonic layer group variable is added to the map. The earthquake data and tectonic plate data are both displayed on the map when the page loads. 

### Major Earthquake Data
I have added the major earthquake data as a third layer group and an overlay object. The d3.json() callback is working and sets the color and diameter of each earthquake, and the major earthquake data is passed to the geoJSON() layer. The geoJSON() layer creates a circle for each major earthquake, and adds a popup for each circle to display the magnitude and location of the earthquake. The major earthquke layer group variable is added to the map. All the earthquake data and tectonic plate data are displayed on the map when the page loads and the datasets can be toggled on or off. 

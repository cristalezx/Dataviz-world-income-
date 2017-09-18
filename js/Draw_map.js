// Da JU
// IGR 205
$(function() {
    $("#slider").slider({
        max: 2015,
        min: 1800,
        value: 2015,
        change: function(event, ui) {
            if (ui.value == year) return;
            $("#text_input").val(ui.value);
            update(ui.value);
        }
    });

    $("#text_input").change(function() {
        $("#slider").slider("value", $("#text_input").val());
    });
});

var year = 2015;
var tooltip = d3.select("#map").append("div")
    .attr("class", "tooltip");

var colors = colorbrewer.GnBu[3]
    // .reverse()
    .map(function(rgb) {
        return d3.hsl(rgb);
    });

var width = 960
var height = 480
var carto;
var max_of_year = 0;
var min_of_year = 0;
var topology_copy;


// var projection = d3.geo.mercator()
//     .scale((width + 1) / 2 / Math.PI)
//     .translate([width / 2, height / 2])
//     .precision(.1);


// var path = d3.geo.path()
//     .projection(projection);
var layer;
var draw_world;

function intial_svg(svg) {

    layer = svg.append("g")
        .attr("id", "layer");
    draw_world = layer.append("g")
        .attr("id", "countries")
        .selectAll("path");


    zoom = d3.behavior.zoom()
        .translate([-38, 32])
        .scale(.94)
        .scaleExtent([0.5, 10.0])
        .on("zoom", updateZoom)

    updateZoom();

}

function updateZoom() {
    var scale = zoom.scale();
    d3.selectAll("path").attr("transform",
        "translate(" + zoom.translate() + ") " +
        "scale(" + [scale, scale] + ")");
}

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geo.equirectangular()
    .scale(153)
    .translate([width / 2, height / 2])
    .precision(.1);

var graticule = d3.geo.graticule();

var path = d3.geo.path()
    .projection(projection);





queue()
    .defer(d3.json, "data/world_map.topojson")
    .defer(d3.csv, "data/GDP_Name.csv")
    .await(ready);

var data = {};
var gdp = {};

function copyObject(o) {
    var obj = {};
    for (var k in o) obj[k] = copy(o[k]);
    return obj;
}


function copy(o) {
    return (o instanceof Array) ? o.map(copy) : (typeof o === "string" || typeof o === "number") ? o : copyObject(o);
}


//  how to get data out of CSV
function update(value) {
    year = value;
    d3.select("h1").html("When the world was in " + year)
    svg.remove();
    svg = d3.selectAll("#map").append("svg")
        .attr("width", width)
        .attr("height", height);
    intial_svg(svg);
    draw_countries(carto, topology_copy)
}

function readData(topology, gdp_name) {
    carto = d3.cartogram()
        .projection(projection)
        .properties(function(d) {
            // this adds the "properties" properties 
            // to the geometries
            var obj = {};
            var getdata = gdp_name.filter(function(n) {
                return d.id == n.id;
            })[0];
            if (typeof getdata === "undefined") {
                for (var year = 1800; year <= 2015; year++) {
                    obj[year] = "undefined";
                }
                obj.name = "undefined";

            } else {
                for (var year = 1800; year <= 2015; year++) {
                    obj[year] = +getdata[year];
                }
                obj.name = getdata.name;
            }

            return obj;
        });
    return carto;
}

function draw_countries(carto, topology) {
    var features = carto.features(topology, topology.objects.countries.geometries)
    intial_svg(svg);

    hi = d3.max(features, function(d) {
        return d.properties[year];
    });

    lo = d3.min(features, function(d) {
        return d.properties[year];
    });

    var color = d3.scale.linear()
        .range(colors)
        .domain(lo < 0 ? [lo, 0, hi] : [lo, (lo + hi) / 2, hi]);

    // normalize the scale to positive numbers
    var scale = d3.scale.linear()
        .domain([lo, hi])
        .range([1, 100]);

    // tell the cartogram to use the scaled values
    // legend

    carto.value(function(d) {
        if (d.properties[year] === 'undefined') return 1;
        else {
            return scale(d.properties[year]);
        }
    });

    var new_countries = carto(topology, topology.objects.countries.geometries).features;

    var draw_country = svg.selectAll("path")
        .data(new_countries);

    draw_country.enter()
        .append("path")
        .attr("class", "country")
        .attr("id", function(d) {
            return d.properties.name
        })
        .style("fill", function(d) {
            return color(d.properties[year]);
        })
        .attr("d", carto.path);

    draw_country
        .on("mousemove", function(d, i) {
            var mouse = d3.mouse(svg.node()).map(function(d) {
                return parseInt(d);
            });

            tooltip
                .classed("hidden", false)
                .attr("style", "left:" + (mouse[0] + 15) + "px;top:" + (mouse[1] + 100) + "px")
                .html(d.properties.name + '\n' + d.properties[year])
        })
        .on("mouseout", function(d, i) {
            tooltip.classed("hidden", true)
        });

}

function ready(error, topology, gdp_name) {
    if (error) return console.warn(error);
    // data = jQuery.extend(true, {}, topology);
    // gdp = jQuery.extend(true, {}, gdp_name);;
    // Instantiate a slider

    topology_copy = (topology)
        // Call a method on the slider

    // For non-getter methods, you can chain together commands
    carto = readData(topology, gdp_name);
    draw_countries(carto, topology);

}
var timer = undefined;

function autoPlay() {
    if (timer != undefined) {
        clearInterval(timer);
        timer = undefined;
        $('#autoplay').html("auto play")

    } else {
        $('#autoplay').html("Stop")
        var i = $('#slider').slider("option", "value");
        timer = setInterval(function() {
            i = i + 5;
            if (i > 2015) {
                clearInterval(timer);
                $('#autoplay').html("auto play")
            }
            $("#slider").slider("value", i);
        }, 1000);
    }
}

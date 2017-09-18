
var checked1 = d3.select('input[name="dataset"]:checked').node().value
console.log(checked1)

var width = 700,
    height = 500,
    radius = Math.min(width, height) / 2;

//var color = d3.scale.category20();
var color = d3.scale.ordinal()
   // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    .range(["#588C7E", "#F2E394", "#F2AE72", "#D96459", "#8C4646",
      "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"
      ]);

var pie2 = d3.layout.pie()
    .value(function(d) { return d[1800]; })
    //.sort(null);

var arc = d3.svg.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 20);
ele=document.getElementById("pie2")

var svg3 = d3.select(ele).append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 20) + ")");

var title3 = svg3.append("text")
                  .attr("x", "-90px")
                  .attr("y", "-20px")
                  .text("World wealth")
                  .attr("font-family", "Garamond", "serif")
                  .attr("font-size", "30px")
                  .attr("fill", "#8a89a6");


var title13 = svg3.append("text")
              .attr("x", -90)
              .attr("y", 10)
              .text("Distribution in")
              .attr("font-family", "Garamond", "serif")
              .attr("font-size", "30px")
              .attr("fill", "#8a89a6");
var title23 = svg3.append("text")
              .attr("id", "inYear2")
              .attr("x", -80)
              .attr("y", 85)
              .text(checked1)
              .attr("font-family", "Garamond", "serif")
              .attr("font-size", "80px")
              .attr("fill", "black");
var title33 =svg3.append("text")
              .attr("x", - 60)
              .attr("y",  + 120)
              .text("(GDP Total)")
              .attr("font-family", "Arial", "sans-serif")
              .attr("font-size", "15px")
              .attr("fill", "#6b486b");
var tooltip2 =d3.select(ele).append("div")
    .attr("class", "tooltip");
d3.csv("data/gdp_total.csv", type, function(error, data) {
  if (error) throw error;
  var path = svg3.datum(data).selectAll("path")
      .data(pie2)
      .enter().append("path")
      .attr("fill", function(d, i) { return color(i); })
      .attr("d", arc)
      .each(function(d) { this._current = d; })// store the initial angles
      .on("mouseover", function (d) {
      //console.log(d);
          var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); });
          tooltip2
          .classed("hidden", false)
          .attr("style", "left:"+(mouse[0]+15)+"px;top:"+(mouse[1]+100)+"px")
          .html("<strong>" + d.data.Country + "</strong> <br/>" + "$" + d.data[d3.select('input[name="dataset"]:checked').node().value]);
      })
      .on("mouseout", function () {
           tooltip2.classed("hidden", true)
      });

  var autoplay2 = svg3.append("text")
              .attr("x", 150)
              .attr("y", -170)
              .text("AUTO PLAY")
              .attr("font-family", "Arial", "sans-serif")
              .attr("font-size", "15px")
              .attr("fill", "#6b486b")
              .style("text-decoration", "underline")
              .on("click", play);

  d3.selectAll("input")
      .on("change", change1);


  function play(){
    setTimeout(function() {
      d3.select("input[value=\"1800\"]").property("checked", true).each(change1);
    }, 500);
    setTimeout(function() {
      d3.select("input[value=\"1850\"]").property("checked", true).each(change1);
    }, 1000);
    setTimeout(function() {
      d3.select("input[value=\"1900\"]").property("checked", true).each(change1);
    }, 2000);
    setTimeout(function() {
      d3.select("input[value=\"1950\"]").property("checked", true).each(change1);
    }, 3000);
    setTimeout(function() {
      d3.select("input[value=\"2000\"]").property("checked", true).each(change1);
    }, 4000);
    setTimeout(function() {
      d3.select("input[value=\"2013\"]").property("checked", true).each(change1);
    }, 5000);
  }

  function change1() {
    var value = this.value;
    console.log(value)
  //  clearTimeout(timeout);
    pie2.value(function(d) { return d[value]; }); // change the value function
    path = path.data(pie2); // compute the new angles
    path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
    d3.select("#inYear2")
      .text(value);
  }
});

function type(d) {
  return d;
}

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

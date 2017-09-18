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
            i = i + 2;
            if (i > 2007) {
                clearInterval(timer);
                $('#autoplay').html("auto play")
            }
            $("#slider").slider("value", i);
        }, 1000);
    }
};

function update(value) {
    year = value;
    d3.select("h1").html("World gini coefficient in " + year)
    map(year);
};

var width  = 1200,
    height = 550;
var click=false;

var color = d3.scale.category10();

var projection = d3.geo.mercator()
                .translate([480, 300])
                .scale(150);

var path = d3.geo.path()
    .projection(projection);

var tooltip = d3.select("#map").append("div")
    .attr("class", "tooltip");

b_1979.onclick=function(){ click=true;year="1979"; update(year);}
b_1980.onclick=function(){ click=true;year="1980"; update(year);}
b_1985.onclick=function(){ click=true;year="1985"; update(year);}
b_1990.onclick=function(){ click=true;year="1990"; update(year);}
b_1995.onclick=function(){ click=true;year="1995"; update(year);}
b_2000.onclick=function(){ click=true;year="2000"; update(year);}
b_2001.onclick=function(){ click=true;year="2001"; update(year);}
b_2002.onclick=function(){ click=true;year="2002"; update(year);}
b_2005.onclick=function(){ click=true;year="2005"; update(year);}
b_2006.onclick=function(){ click=true;year="2006"; update(year);}
b_2007.onclick=function(){ click=true;year="2007"; update(year);}

window.onload = function(){
 year = "2005"; // The year shown on page load
 map(year);
}
var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.behavior.zoom()
    .on("zoom", redraw))
    .append("g");
for(var i=0;i<8;i++){

var text=svg.append("text")
  .attr("x",45)
  .attr("y",500-15*i+9)
  .text(function(){
    if (i==0){
      return "no value";
    }
    if (i==1){
      return "55-60";
    }
    if (i==2){
      return  "50-55";
    }

    if (i==3){
      return "45-50";
    }
    if (i==4){
      return "40-45";
    }
    if (i==5){
      return "35-40";
    }
    if (i==6){
      return "30-35";
    }
    if (i==7){
      return "25-30";
    }

  })
var rect = svg.append("rect")
  .attr("x",10)
  .attr("y",500-15*i)
  .attr("width",30)
  .attr("height",12)
  .attr("fill",function(){

    if (i==0){
      return "#BDBDBD";
    }
    if (i==1){
      return "#DF0101";
    }
    if (i==2){
      return  "#FE642E";
    }

    if (i==3){
      return "#F7BE81";
    }
    if (i==4){
      return "#F6E3CE";
    }
    if (i==5){
      return "#D8F781";
    }
    if (i==6){
      return "#40FF00";
    }
    if (i==7){
      return "#31B404";
    }
  })
}


function redraw() {
    svg.selectAll(".country").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}


function map(year){
  if(click==true){
  svg.selectAll(".country").remove();
   }
queue()
    .defer(d3.json, "world-110m.json")
    .defer(d3.tsv, "world-country-names.tsv")
    .defer(d3.csv,"gini-2.csv")
    .await(ready);

function ready(error, world, names,ginidata) {

  var countries = topojson.object(world, world.objects.countries).geometries,
      neighbors = topojson.neighbors(world, countries),
      i = -1,
      n = countries.length;
  var c=0
  var cc=0
  countries.forEach(function(d) {
    d.year=year;
    var tryit = names.filter(function(n) { return d.id == n.id; })[0];
    if (typeof tryit === "undefined"){
      d.name = "Undefined";
    } else {
      d.name = tryit.name;
    }
    var trydata=ginidata.filter(function(g){return g["GINI index"]==d.name;})[0]

    if (typeof trydata === "undefined"){
      d.gini = "";
    }
    else {
      cc++;
      if (trydata[year]==""){
        d.gini=""
        c++;
      }
      else{
        d.gini = trydata[year];
      }
    }

  })
  // console.log(c,cc)

var country = svg.selectAll(".country").data(countries);

// console.log(year)

country
    .enter()
    .insert("path")
    .attr("class", "country")
    .attr("title", function(d,i) { return d.name; })
    .attr("d", path)
    .style("fill",function(d){
        return ginicolor(d.gini)});
    //Show/hide tooltip
    country
      .on("mousemove", function(d,i) {
        console.log(d.name)
        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); });
        tooltip
          .classed("hidden", false)
          .attr("style", "left:"+(mouse[0]+15)+"px;top:"+(mouse[1]+100)+"px")
          .html(d.name+"\n"+"gini coefficient in the year  " +d.year+" is:"+d.gini)
      })
      .on("mouseclick",function(d){
        // console.log(d.name)

      })
      .on("mouseout",  function(d,i) {
        tooltip.classed("hidden", true)
      })


      function ginicolor(gini){
        if(gini==""){
          return "#BDBDBD"
          console.log(year+"ddddd");

        }
        if(gini>=25 && gini<=30){
          return "#31B404"
        }
        if(gini>30 && gini<=35){
          return  "#40FF00"
        }
        if(gini>35 && gini<=40){
          return "#D8F781"
        }
        if(gini>40 && gini<=45){
          return "#F6E3CE"
        }
        if(gini>45 && gini<=50){
          return "#F7BE81"
        }
        if(gini>50 && gini<=55){
          return "#FE642E"
        }
        if(gini>55 && gini<=60){
          return "#DF0101"
        }
      }
}
}

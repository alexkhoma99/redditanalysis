var width = 1033;
var height = 600;
console.log("width: " + width);
console.log("hegh: " + height);

// Get data into D3-friendly format: Array of JSONs

function formatData() {
  var jsonArray = [];
  var svg = d3.select("#chart")
    .append("svg")
    .attr("id", "main-svg")
    .attr("height", height)
    .attr("width", width)
    .attr("margin", "auto")
    .attr("align", "center")
    .append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

  var radiusScale = d3.scaleSqrt().domain([1,2000]).range([20,250]);
  var fontScale = d3.scaleSqrt().domain([1,600]).range([8,25]);

  var simulation = d3.forceSimulation()
    .force("x", d3.forceX().strength(0.002))
    .force("y", d3.forceY().strength(0.06))
    .force("collide", d3.forceCollide(function(d) {
      //console.log(d);
      return radiusScale(d.count);
    }));

  console.log("formatting data");
  for ([k,v] of comMap.entries()) {
    var miniJson = {};
    miniJson["name"] = k;
    miniJson["count"] = v;
    jsonArray.push(miniJson);
  }
  var groups = svg.selectAll(".subreddit-group")
    .data(jsonArray)
    .enter().append("g")
    .attr("class", "subreddit-group");


    groups.append("circle")
    .attr("r", function(d) {
      return radiusScale(d.count);
    })
    .attr("class", "mycir")
    .attr("fill", "#FF5700")
    .attr("stroke-width", 0)
    .attr("stroke", "#000000")
    .on("mouseover", outline)
    .on("mouseout", removeOutline)
    .on("click", d => window.open('https://www.reddit.com/r/' + d.name));

    groups.append("text")
    .style("font", function(d) {return (fontScale(d.count))+"px Open\ Sans"})
    .attr("text-anchor", "middle")
    .style("display", d => d.count > 0 ? "inline-block" : "none")
    .text(function(d) {return d.name})
    .style("max-width", 20)


  console.log("fs: " + fontScale(2));

  simulation.nodes(jsonArray).on('tick', ticked);
  circles = groups.selectAll("circle");
  texts = groups.selectAll("text");


  function ticked() {
    circles
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      })
    texts
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      })
  }

  function outline(d) {
    var h = document.getElementById("account-activity").innerHTML = "/r/" + d.name + " - " + d.count + " Submissions";
    var old;
    d3.select(this)
      .attr("stroke-width", 1);
    old = d3.select(this).attr("fill");
    d3.select(this).attr("old-color", "#0079d3");
    d3.select(this).attr("fill", "#0079d3");
  }
  function removeOutline() {
    document.getElementById("account-activity").innerHTML = "Account Activity";
    d3.select(this)
      .attr("stroke-width", 0);
    d3.select(this).attr("fill", d3.select(this).attr("old-color"))
      .attr("fill", "#FF5700");
  }

  //console.log(circles);
}

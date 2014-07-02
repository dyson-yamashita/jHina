
!function(){
  var jHina = {
      version: "0.1"
  };

  jHina.chord = function(canvasId,graph) {
    var width =  300,
        height = 300,
        innerRadius =  Math.min(width, height) * .32,
        outerRadius = innerRadius * 1.1,
        data = {
          labels: getLabels(graph),
          matrix: getMatrix(graph)
        };

    var chord = d3.layout.chord()
                  .padding(.05)
                  .sortSubgroups(d3.descending)
                  .matrix(data.matrix);
                  
    var svg = d3.select("#"+canvasId).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.append("g").selectAll("path")
       .data(chord.groups)
       .enter().append("path")
       .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
       .attr("fill", function(d) { return color(data.labels[d.index]); })
       .on("mouseover", fade(.1))
       .on("mouseout", fade(1));

    var ticks = svg.append("g").selectAll("g")
                   .data(chord.groups)
                   .enter().append("g").selectAll("g")
                   .data(captions)
                   .enter().append("g")
                   .attr("transform", function(d) {
                     return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                      + "translate(" + outerRadius + ",0)";
                   });

    ticks.append("text")
         .attr("x", 6)
         .attr("dy", ".2em")
         .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
         .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
         .text(function(d) { return d.label; });

    svg.append("g")
       .attr("class", "chord")
       .selectAll("path")
       .data(chord.chords)
       .enter().append("path")
       .attr("d", d3.svg.chord().radius(innerRadius))
       .style("fill", function(d) { return color(data.labels[d.target.index]); })
       .style("opacity", 1);

    function getLabels(g){
      var labels = new Array(g.nodes.length);
      for(var i = 0; i < g.nodes.length; i++){
          labels[i] = g.nodes[i].label;
      }
      return labels;
    }

    function getMatrix(g){
      var idMap = {};
      var matrix = new Array(g.nodes.length);

      for(var i = 0; i < g.nodes.length; i++){
        idMap[g.nodes[i].id] = i;
        matrix[i] = new Array(g.nodes.length);

        for(var j = 0; j < g.nodes.length; j++){
       　 matrix[i][j] = 0;
      　}
      }

      for(var i = 0; i < g.edges.length; i++){
        matrix[idMap[g.edges[i].source]][idMap[g.edges[i].target]] += g.edges[i].weight;
        matrix[idMap[g.edges[i].target]][idMap[g.edges[i].source]] += g.edges[i].weight / 4;
      }
      return matrix;
    }
    
    function captions(d) {
        return [{
          angle: (d.endAngle - d.startAngle) / 2 + d.startAngle,
          label: data.labels[d.index]
        }];
    }

    function fade(opacity) {
      return function(g, i) {
        svg.selectAll(".chord path")
          .filter(function(d) { return d.source.index != i && d.target.index != i; })
          .transition()
          .style("opacity", opacity);
      };
    }


  };
  function color(text) {
    var color = new Array(3);
    color[0]=0;
    color[1]=0;
    color[2]=0;

    var hex = function(d){
      return d.toString(16).replace(/^[0-9a-f]$/,"0$&");
    }

    if(text.length){
        for(var i=0; i < 3; i++){
            color[i] += text.charCodeAt(i % text.length) * 2;
            color[i] = color[i] % 255
        }
    }
    return "#"+ hex(color[0]) + hex(color[1]) + hex(color[2]); 
  }

  
     
  jHina.graph = function(canvasId,graph){
    var width = 300,
        height = 300,
        linkDistances = [100],
        negCharges = [-100],
        nodeSize = 8,
        radius = 25,
        edgeClass = "edge",
        nodeClass = "node";

    var layout = d3.layout.force()
                   .nodes(graph.nodes)
                   .links(graph.edges)
                   .size([width,height])
                   .linkDistance(linkDistances)
                   .charge(negCharges)
                   .gravity(0.05)
                   .start();

    var svg = d3.select("#"+canvasId)
                .append("svg")
                .attr("width",width)
                .attr("height",height)
                .attr("class","graph");

    var hexbin = d3.hexbin()
                   .size([width,height])
                   .radius(radius);
                 
    var points = new Array();
    for(var y=0; y < height+radius; y += radius){
      for(var x=0; x < width+radius; x += radius){
        points.push([x,y]);
        }
     }

    svg.append("g")
       .selectAll(".hxagon")
       .data(hexbin(points))
       .enter().append("path")
       .attr("class", "hexagon")
       .attr("d", hexbin.hexagon())
       .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
       .style("fill", "none")
       .style("stroke", "#eee");

    var edges = svg.selectAll("line")
                   .data(graph.edges)
                   .enter()
                   .append("line")
                   .attr("class",edgeClass)
                   .attr("stroke","#555")
                   .attr("stroke-width",function(e){ return e.width });

    var nodes = svg.selectAll("circle")
                   .data(graph.nodes)
                   .enter()
                   .append("circle")
                   .attr("r",nodeSize)
                   .attr("class",nodeClass)
                   .attr("fill",function(n){ return color(n.label) })
                   .call(layout.drag);

    var nodeLabels = svg.selectAll("text")
                        .data(graph.nodes)
                        .enter()
                        .append("text")
                        .text(function(n){ return n.label });

    layout.on("tick", function(){
      edges.attr("x1", function(d) { return d.source.x; })
           .attr("y1", function(d) { return d.source.y; })
           .attr("x2", function(d) { return d.target.x; })
           .attr("y2", function(d) { return d.target.y; });     
      nodes.attr("cx", function(d) { return d.x; })
           .attr("cy", function(d) { return d.y; });
      nodeLabels.attr("x", function(d) { return d.x - 20; })
                .attr("y", function(d) { return d.y + 30; });            
    });
  };
  this.jHina = jHina;
}();


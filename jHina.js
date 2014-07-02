
!function(){
  var jHina = {
      version: "0.1"
  };

  jHina.chord = function(canvasId,graph) {
    var width =  400;
    var height = 400;
    var innerRadius =  Math.min(width, height) * .4;
    var outerRadius = innerRadius * 1.1;
    var data = {
      labels: getLabels(graph),
      matrix: getMatrix(graph)
    };
    console.log(data);
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
      .style("fill", function(d) { return textToColor(data.labels[d.index]); })
      .style("stroke", function(d) { return textToColor(data.labels[d.index]); })
      .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
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
        .attr("x", 8)
        .attr("dy", ".35em")
        .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
        .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .text(function(d) { return d.label; });

    svg.append("g")
      .attr("class", "chord")
      .selectAll("path")
      .data(chord.chords)
      .enter().append("path")
      .attr("d", d3.svg.chord().radius(innerRadius))
      .style("fill", function(d) { return textToColor(data.labels[d.target.index]); })
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

    function textToColor(text) {
      var color = new Array(3);
      color[0]=0;
      color[1]=0;
      color[2]=0;
      
      if(text.length){
          for(var i=0; i < 3; i++){
              color[i] += text.charCodeAt(i % text.length) * 2;
              color[i] = color[i] % 255
          }
      }
      return "#"+ hex(color[0]) + hex(color[1]) + hex(color[2]); 
    }
    function hex(d){
      return d.toString(16).replace(/^[0-9a-f]$/,"0$&");
    }
  };

  jHina.graph = function(){};

  this.jHina = jHina;
}();


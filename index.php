<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>jHina</title>
<style>

body {
  font: 14px sans-serif;
}

.chord path {
  fill-opacity: .6;
  stroke: #222;
  stroke-width: .5px;
}

#chord_area {
  width: 306px;
  height: 306px;
  border: solid 1px #aac;
  border-radius: 8px;
  margin: 5px;
}

#graph_area {
  width: 300px;
  height: 300px;
  border: solid 1px #aac;
  border-radius: 8px;
  padding: 3px;
  margin: 5px ;
}

</style>
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">

<!-- Optional theme -->
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">

<!-- Latest compiled and minified JavaScript -->
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
</head>
<body>
  <div class="container">
      <div class="header">
        <ul class="nav nav-pills pull-right">
          <li class="active"><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <h3 class="text-muted">Project name</h3>
      </div>
  </div>
  <div id="chord_area"></div>
  hogehoge
  <div id="graph_area"></div>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="http://d3js.org/d3.hexbin.v0.min.js"></script>
<script src="jHina.js"></script>
<script>

var graph = {
  "nodes": [
    { "id": 0,
      "label": "Alice" 
    },
    { "id": 1,
      "label": "Kery" 
    },
    { "id": 2,
      "label": "Watson" 
    },
    { "id": 3,
      "label": "Eve" 
    },
    { "id": 4,
      "label": "Rose" 
    }
  ],
  "edges":[
    { "source": 0, "target": 1,
      "weight": 0.3 
    },
    { "source": 2, "target": 1,
      "weight": 0.3 
    },
    { "source": 2, "target": 3,
      "weight": 0.3 
    },
    { "source": 3, "target": 4,
      "weight": 0.3 
    },
    { "source": 2, "target": 4,
      "weight": 0.2
    }
  ]
};

jHina.chord("chord_area",graph);
jHina.graph("graph_area",graph);
</script>
</body>
</html>


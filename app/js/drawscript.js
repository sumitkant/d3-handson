(function draw() {
	'use strict';
	var data = [4, 31, 15, 16, 23, 42],
		dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                11, 12, 15];
	//D3 bsic Selections
	// generates an unordered list of data
	d3.select(".container").append("ul").selectAll("li")
		.data(data)
		.enter().append("li")
		.text(function (d) {
			return "I’m number " + d + "!";
		});

	// alternates the colors
	d3.selectAll("li").style("color", function (d, i) {
		return i % 2 ? "#E74C3C" : "#26A65B";
	});

	//Horizontal Bar Chart
	//draws an horizontal bargraph
	d3.select(".barchart").append("ul").selectAll("li")
		.data(data)
		.enter().append("li")
		.style("width", function (d) {
			return d * 5 + "px";
		})
		.style("height", "30px")
		.style("background-color", "#1BBC9B")
		.style("margin-bottom", "5px");

	// Vertical Bar Chart
	// draws a vertical bar graph
	d3.select(".barchart_vert").append("div").selectAll("div")
		.data(dataset)
		.enter().append("div")
		.style("display", "inline-block")
		.style("margin-right", "5px")
		.style("height", function (d) {
			return d * 5 + "px";
		})
		.style("width", "40px")
		.style("background-color", "tomato")
		.style("margin-bottom", "5px")
		.style("vertical-align", "bottom")
		.append("p").attr("class", "label").text(function (d) {
			return d;
		});


	//scatter plot
	d3.json("../json/scatter.json", function (json) {
		var scatterData = json,
			width = 800,
			height = 500,
			margin = 50,
			x_extent = d3.extent(scatterData, function (d) {
				return d.x_value;
			}),
			y_extent = d3.extent(scatterData, function (d) {
				return d.y_value;
			}),
			x_scale = d3.scale.linear().range([margin, width - margin]).domain(x_extent),
			y_scale = d3.scale.linear().range([margin, height - margin]).domain(y_extent);

		console.log(x_extent);
		console.log(y_extent);
		console.log(x_scale);
		console.log(y_scale);

		//the scatter plot
		d3.select(".scatterPlot")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.selectAll("circle")
			.data(scatterData)
			.enter()
			.append("circle");

		d3.selectAll("circle")
			.attr("cx", function (d) {
				return x_scale(d.x_value)
			})
			.attr("cy", function (d) {
				return y_scale(d.y_value)
			})
			.attr("r", function (d) {
				return d.intensity;
			});


		var x_axis = d3.svg.axis().scale(x_scale);
		d3.select("svg")
			.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (height - margin) + ")")
			.call(x_axis);

		var y_axis = d3.svg.axis().scale(y_scale).orient("left");
		d3.select("svg")
			.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + margin + ", 0 )")
			.call(y_axis);

		//Axis titles
		d3.select(".x.axis")
			.append("text")
			.text("X_VALUE_LABEL")
			.attr("x", (width / 2) - margin)
			.attr("y", margin / 1.5);

		d3.select(".y.axis")
			.append("text")
			.text("Y_VALUE_LABEL")
			.attr("transform", "rotate (-90, -43, 0) translate(-380)");
	});

	//extents = returns min and max value of its arguments

	//DendoGram
	//    var radius = 960 / 2;
	//
	//    var cluster = d3.layout.cluster()
	//        .size([360, radius - 120]);
	//
	//    var diagonal = d3.svg.diagonal.radial()
	//        .projection(function (d) {
	//            return [d.y, d.x / 180 * Math.PI];
	//        });
	//
	//    var svg = d3.select("body").append("svg")
	//        .attr("width", radius * 2)
	//        .attr("height", radius * 2)
	//        .append("g")
	//        .attr("transform", "translate(" + radius + "," + radius + ")");
	//
	//    d3.json("../json/dendo1.json", function (error, root) {
	//        var nodes = cluster.nodes(root);
	//
	//        var link = svg.selectAll("path.link")
	//            .data(cluster.links(nodes))
	//            .enter().append("path")
	//            .attr("class", "link")
	//            .attr("d", diagonal);
	//
	//        var node = svg.selectAll("g.node")
	//            .data(nodes)
	//            .enter().append("g")
	//            .attr("class", "node")
	//            .attr("transform", function (d) {
	//                return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
	//            });
	//
	//        node.append("circle")
	//            .attr("r", 4.5);
	//
	//        node.append("text")
	//            .attr("dy", ".31em")
	//            .attr("text-anchor", function (d) {
	//                return d.x < 180 ? "start" : "end";
	//            })
	//            .attr("transform", function (d) {
	//                return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
	//            })
	//            .text(function (d) {
	//                return d.name;
	//            });
	//    });
	//
	//    d3.select(self.frameElement).style("height", radius * 2 + "px");

}());

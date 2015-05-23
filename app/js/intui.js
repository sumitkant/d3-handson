(function () {
	'use strict';

	d3.json("../govtdata/RevenueDeficit.json", function (json) {
		var data = json.data,
			fields = json.fields,
			states = [],
			years = [],
			stateDeficit = [];

		//creates the states array
		for (var i = 0; i < data.length; i++) {
			states.push(data[i][0])
		};
		console.log(states);

		//create years label
		for (var i = 1; i < fields.length; i++) {
			years.push(fields[i].label)
		};
		console.log(years);

		//generate values
		for (var j = 0; j < data.length; j++) {
			var temp = [];
			for (var i = 1; i < data[j].length; i++) {
				temp.push(data[j][i]);
			};
			stateDeficit.push(temp);
		}
		console.log(stateDeficit);

		var container_dimensions = {
				width: 900,
				height: 500
			},
			margins = {
				top: 10,
				right: 20,
				bottom: 30,
				left: 60
			},

			chart_dimensions = {
				width: container_dimensions.width - margins.left - margins.right,
				height: container_dimensions.height - margins.top - margins.bottom
			},

			chart = d3.select("#visualization")
			.append("svg")
			.attr("width", container_dimensions.width)
			.attr("height", container_dimensions.height)
			.append("g")
			.attr("transform", "translate(" + margins.left + "," + margins.top + ")")
			.attr("id", "chart");
		var time_scale = d3.time.scale()
			.range([0, chart_dimensions.width])
			.domain([new Date(1998, 0), new Date(2014, 0)]);
		var percent_scale = d3.scale.linear()
			.range([chart_dimensions.height, 0])
			.domain([-10, 10]);
		var time_axis = d3.svg.axis()
			.ticks(17)
			.scale(time_scale);
		var count_axis = d3.svg.axis()
			.scale(percent_scale)
			.orient("left");
		chart.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + chart_dimensions.height + ")")
			.call(time_axis);
		chart.append("g")
			.attr("class", "y axis")
			.call(count_axis);
		d3.select(".y.axis")
			.append("text")
			.attr("text-anchor", "middle")
			.text("percent on time")
			.attr("transform", "rotate (-270, 0, 0)")
			.attr("x", container_dimensions.height / 2)
			.attr("y", 50);

		var key_items = d3.select("#key")
			.selectAll("div")
			.data(states)
			.enter()
			.append("div")
			.attr("class", "key_line");

		key_items.append("div")
			.attr("id", function (d) {
				return;
			})
			.attr("class", "key_square");
		key_items.append("div")
			.attr("class", "key_label")
			.text(function (d) {
				return d;
			});

		d3.select("svg").append("g")
			.selectAll("g")
			.data(stateDeficit)
			.enter()
			.append("g")
			.attr("class", "dataPoints");

		d3.selectAll(".dataPoints")
		.selectAll("circle")
			.data(stateDeficit)
			.enter()
			.append("circle");

		d3.selectAll("circle")
			.attr("cx", function (d) {
				return;
			})
			.attr("cy", function (d) {
				for (var i = d.length - 1; i >= 0; i--) {
					for (var j = d[i].length - 1; j >= 0; j--) {
						return d[i][j];
					};
				};
			})
			.attr("r", function (d) {
				return 5;
			});

	});
}());

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

		//create years label
		for (var i = 1; i < fields.length; i++) {
			years.push(fields[i].label)
		};

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
		var timeDomain = [new Date(1998, 0), new Date(2014, 0)]
		var time_scale = d3.time.scale()
			.range([0, chart_dimensions.width])
			.domain(timeDomain);
		var percent_scale = d3.scale.linear()
			.range([chart_dimensions.height, 0])
			.domain([-30, 30]);
		var time_axis = d3.svg.axis()
			.ticks(years.length)
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
			.attr("class", "key_line")
			.attr("data-id", function (d, i) {
				return i;
			});

		key_items.append("div")
			.attr("class", "key_square");

		key_items.append("div")
			.attr("class", "key_label")
			.text(function (d) {
				return d;
			});

		var g = d3.select("svg").append("g")
			.attr("transform", "translate(60,0)")

		key_items.on("click", function (e) {
			var _this = this;
			var nodes = _this.parentElement.childNodes;
			for (var i = 0; i < nodes.length; i++) {
				if (nodes[i].className === "key_line active" ) {
					nodes[i].className = "key_line";
				}
			}
			_this.className = "key_line active";
			var data = stateDeficit[this.getAttribute("data-id")];

			var y_scale = d3.scale.linear()
				.domain([-30, 30])
				.range([container_dimensions.height, 0]);

			//			var line = d3.svg.line()
			//				.x(function (d, i) {
			//					return i * 55;
			//				})
			//				.y(function (d) {
			//					return y_scale(d);
			//				})
			//				.interpolate("basis");
			//
			//			g.select("path")
			//				.data(data)
			//				.enter()
			//				.append("path")
			//				.attr("d", line)
			//				.style("stroke", 2);

			g.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.style("fill", "#16A085")

			d3.selectAll("circle")
				.attr("cx", function (d, i) {
					return i * 55;
				})
				.attr("cy", function (d, i) {
					return y_scale(d);
				})
				.attr("r", function (d, i) {
					return 5;
				});

		});

	});
}());

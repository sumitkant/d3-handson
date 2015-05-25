(function () {
	'use strict';

	d3.json("../govtdata/RevenueDeficit.json", function (json) {

		// MAKING SENSE OUT OF DATA ==============================
		var data = json.data,
			fields = json.fields,
			_STATES_ = [],
			_YEARS_ = [],
			_STATE_DEFICIT_ = [];

		//creates the _STATES_ array
		for (var i = 0; i < data.length; i++) {
			_STATES_.push(data[i][0])
		};

		//create _YEARS_ label array
		for (var i = 1; i < fields.length; i++) {
			_YEARS_.push(fields[i].label)
		};

		//generate values
		for (var j = 0; j < data.length; j++) {
			var temp = [];
			for (var i = 1; i < data[j].length; i++) {
				// case where values are "NA"
				if (data[j][i] == "NA") {
					data[j][i] = -200; //chuck "NA" it off the chart
				}
				temp.push(data[j][i]);
			};
			_STATE_DEFICIT_.push(temp);
		}

		// CHART PROPERTIES ================================
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
			.attr("id", "chart"),

			tooltip = d3.select('body').append('div')
			.style('position', 'absolute')
			.style('padding', '0 10px')
			.style('background', 'white')
			.style('opacity', 0),


			stateName = d3.select('#stateName')
			.style('padding', '5px 10px')
			.style('text-decoration', "underline")
			.style("font-size", "0.8em")
			.style("color", "#16A085"),

			timeDomain = [new Date(1998, 0), new Date(2014, 0)],

			time_scale = d3.time.scale()
			.range([0, chart_dimensions.width])
			.domain(timeDomain),

			percent_scale = d3.scale.linear()
			.range([chart_dimensions.height, 0])
			.domain([-30, 30]),

			time_axis = d3.svg.axis()
			.ticks(_YEARS_.length)
			.scale(time_scale),

			count_axis = d3.svg.axis()
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
			.text("Percentage -- Deficit / surplus")
			.attr("transform", "rotate (-270, 0, 0)")
			.attr("x", container_dimensions.height / 2)
			.attr("y", 50);

		var key_items = d3.select("#key")
			.selectAll("div")
			.data(_STATES_)
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

		var g_circles = d3.select("svg").append("g")
			.attr("transform", "translate(60,-10)"),

			g_curve = d3.select("svg").append("g")
			.attr("transform", "translate(60,-10)"),

			line = d3.svg.line()
			//CLICK EVENT LISTENER ON KEYS
		var getRandomInt = function (min, max) {
			return Math.round(Math.random() * (max - min + 1)) + min;
		}(0, _STATES_.length);

		var plotCircles = function (data) {
			var _this, dataId;
			if (this) { // check where the circle is ther  or not
				_this = this;
				dataId = d3.select(_this).attr("data-id");
				data = _STATE_DEFICIT_[dataId];
				stateName.html(_STATES_[dataId])
				if (_this.parentElement.childNodes) {
					var KEY_NODES = _this.parentElement.childNodes;
					for (var i = 0; i < KEY_NODES.length; i++) {
						if (KEY_NODES[i].className === "key_line active") {
							KEY_NODES[i].className = "key_line";
						}
					};
					_this.className = "key_line active";
				} else {
					return;
				}
			} else {
				// to plot a random data on reload
				data = _STATE_DEFICIT_[getRandomInt];
				// makes the STATE for whic the graph is plotted active
				var selection = d3.selectAll(".key_line")[0][getRandomInt];
				selection.className = "key_line active";
				stateName.html(_STATES_[getRandomInt]);
			}

			var y_scale = d3.scale.linear()
				.domain([-30, 30])
				.range([container_dimensions.height, 0]);

			g_circles.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.style("fill", "#16A085")

			d3.selectAll("circle")
				.on("mouseover", function (d) {

					tooltip.transition()
						.style("opacity", 0.9)
					tooltip.html(d + "%")
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY - 30) + "px")

					d3.select(this)
						.transition()
						.ease("elastic")
						.duration(200)
						.style("stroke-width", 10);
				})
				.on("mouseleave", function () {
					tooltip.transition()
						.style("opacity", 0)

					d3.select(this)
						.transition()
						.ease("elastic")
						.duration(200)
						.style("stroke-width", 2);
				})
				.transition()
				.duration(300)
				.attr("cx", function (d, i) {
					return i * 51;
				})
				.attr("cy", function (d, i) {
					return y_scale(d);
				})
				.attr("r", function (d, i) {
					return 5;
				})
				.style("fill", "#16A085")
				.style("stroke", "#16A085")
				.style("stroke-width", 2)


			var line = d3.svg.line()
				.x(function (d, i) {
					return i * 55;
				})
				.y(function (d) {
					return y_scale(d);
				})
				.interpolate("basis");

			g_curve.append("path")
				.attr("d", line(data));
		};



		// adding event listener
		key_items.on("click", plotCircles);
		plotCircles();

	});
}());

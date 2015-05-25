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

		var plotCircles = function (data) {
			var _this;
			if (this) {
				_this = this;
				data = _STATE_DEFICIT_[d3.select(_this).attr("data-id")];
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
				data = _STATE_DEFICIT_[16];
				var selection = d3.selectAll(".key_line")[0][16];
				selection.className = "key_line active";
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
		};

		// adding event listener
		key_items.on("click", plotCircles);
		plotCircles();
	});
}());

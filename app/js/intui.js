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

		var
			g_curve = d3.select("svg").append("g")
			.attr("transform", "translate(60,10)")
			.attr("id", "pathContainer"),

			g_circles = d3.select("svg").append("g")
			.attr("transform", "translate(60,-10)"),

			// the zero line
			lineData = [
				{
					"x": 0,
					"y": (chart_dimensions.height / 2)
				},
				{
					"x": chart_dimensions.width,
					"y": chart_dimensions.height / 2
				}
			],

			theZeroLine = d3.svg.line()
			.x(function (d) {
				return d.x;
			})
			.y(function (d) {
				return d.y;
			}),

			_CURVE_DATA_ = [];

		g_curve.append("g").append("path")
			.attr("d", theZeroLine(lineData))
			.style("stroke-width", 1)
			.style("stroke", "gray");

		//generate a random curve on load
		var getRandomInt = function (min, max) {
			return Math.round(Math.random() * (max - min + 1)) + min;
		}(0, _STATES_.length);

		//plot circles and curve
		var plotter = function (data) {
			var _this,
				dataId,
				y_scale = d3.scale.linear()
				.domain([-30, 30])
				.range([container_dimensions.height, 0]);


			// check where the circle is there or not
			if (this) {
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
				// makes the STATE for whic the graph is plott ed active
				var selection = d3.selectAll(".key_line")[0][getRandomInt];
				selection.className = "key_line active";
				stateName.html(_STATES_[getRandomInt]);
			} // else


			var curveStorkeWidth = 3,
				theCurve = d3.svg.line()
				.x(function (d, i) {
					return i * 51;
				})
				.y(function (d) {
					if (d == -200) {
						return y_scale(0);
					} else {
						return y_scale(d);
					}
				})
				.interpolate("cardinal");

			var curvesContainer = d3.select("#pathContainer")[0][0];
			console.log(curvesContainer.childNodes.length);
			if (curvesContainer.childNodes.length > 1) {
				d3.selectAll(".curves").transition(250).ease("elastic").remove();
			}

			g_curve.append("g")
				.attr("transform", "translate(0," + (-20) + ")")
				.attr("class", "curves")
				.append("path")
				.attr("d", theCurve(data))
				.style("stroke-width", curveStorkeWidth)
				.style("stroke", "#16A085");

			g_circles.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.style("fill", "#16A085")

			//tooltip application
			d3.selectAll("circle")
				.on("mouseover", function (d) {
					tooltip.transition()
						.style("opacity", 0.9)
					tooltip.html(d + "%")
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY - 30) + "px")
						.style("font-size", 20 + "px");

					d3.select(this)
						.transition()
						.ease("elastic")
						.duration(250)
						.attr("r", 15);
				})
				.on("mouseleave", function () {
					tooltip.transition()
						.style("opacity", 0)

					d3.select(this)
						.transition()
						.ease("elastic")
						.duration(250)
						.attr("r", 8);
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
					return 8;
				})
				.style("fill", "#16A085")
				.style("stroke", "black")
				.style("stroke-width", 2)
		};

		//CLICK EVsENT LISTENER ON KEYS
		key_items.on("click", plotter);
		plotter();
	});
}());

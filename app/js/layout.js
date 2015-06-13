(function () {
	'use strict';

	var ctx = document.getElementById("myChart").getContext("2d"),
		data = [
			{
				value: 300,
				color: "#F7464A",
				highlight: "#FF5A5E",
				label: "Red"
    	},
			{
				value: 50,
				color: "#46BFBD",
				highlight: "#5AD3D1",
				label: "Green"
    	},
			{
				value: 100,
				color: "#FDB45C",
				highlight: "#FFC870",
				label: "Yellow"
			}
		],

		myDoughnutChart = new Chart(ctx).Doughnut(data, {
			animateScale: true,
			animateRotate: true,
			percentageInnerCutout: 70,
			segmentStrokeWidth: 2,
			segmentStrokeColor: "white",
			animationEasing: "easeOutQuart",
			animationSteps: 40,
			legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",

		});

}());

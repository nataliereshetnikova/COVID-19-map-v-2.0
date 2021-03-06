import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import axios from "axios";
import Layout from "components/Layout";
import leaflet from "echarts-leaflet";
import ReactEcharts from "echarts-for-react";


function setLastUpdated(date, days) {
  let lastUpdated = document.getElementById("lastUpdated");
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  const dOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  lastUpdated.innerHTML = copy.toLocaleDateString("en-US", dOptions);
}

const HistoryPage = () => {

    let echartsOption = {
        baseOption: {
          tooltip: {
            show: true,
            formatter: function (params) {
              return params.value[3] + ":" + params.value[2];
            },
          },
          series: [
            {
              type: "scatter",
              animation: false,
              coordinateSystem: "leaflet",
              data: [],
              symbolSize: function (value) {
                return value[2] > 0 ? Math.log(value[2]) * 3 : 0;
              },
              itemStyle: {
                color: "red",
                borderWidth: 2,
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
            },
          ],
          visualMap: {
            type: "continuous",
            min: 0,
            max: 300,
            inRange: {
              color: ["yellow", "red"],
              opacity: [0.5, 0.8],
            },
            dimension: 2,
          },
          leaflet: {
            center: [0, 40],
            zoom: 3,
            roam: true,
            tiles: [
              {
                urlTemplate:
                  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
              },
            ],
          },
        },
      };

  const [chartOptions, setOptions] = useState(null);
  const apiURL =
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
  
    useEffect(()=>{
      async function fetchData(){
        const responseHistory = await axios.get(apiURL);
        const HistoryData = responseHistory.data;
        const hasHistoryData = HistoryData.length > 0;
        if (!hasHistoryData) return;
        var lines = HistoryData.split("\n");

        var result = [];
        for (var i = 1; i < lines.length; ++i) {
          var columns = lines[i].split(",");
    
          for (var j = 4; j < columns.length; ++j) {
            var value = [
              columns[3],
              columns[2],
              columns[j],
              columns[0] + " " + columns[1],
            ];
            var id = j - 4;
            if (result[id]) {
              result[id].push(value);
            } else {
              result[id] = [value];
            }
          }
      }
    //set last updated data:
    setLastUpdated(new Date(2020, 0, 22), result.length - 1);

    var options = result.map(function (day) {
      return {
        series: {
          data: day,
        },
      };
    });

    let timeline = {
      axisType: "category",
      data: lines[0].split(",").slice(4),
      autoPlay: true,
      playInterval: 500,
      symbolSize: 4,
      tooltip: {
        formatter: function (params) {
          return params.name;
        },
      },
      itemStyle: {
        color: "#ccc",
      },
      lineStyle: {
        color: "#eee",
      },
      label: {
        color: "#999",
      },
      checkpointStyle: {
        color: "red",
      },
      controlStyle: {
        borderColor: "#bbb",
      },
    };
    echartsOption.timeline = timeline;
    echartsOption.options = options;
    setOptions(echartsOption);
    }
    fetchData();
  },[]);

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Cases Timeline</title>
      </Helmet>
      <div className="historyLegend">
        <span className="orange">less than 50000 Cases</span>
        <span className="orangered">50 - 150 Cases</span>
        <span className="red">more than 150 Cases</span>
      </div>
      <ReactEcharts
        option={chartOptions?chartOptions:{}}
        style={{ height: "80vh", width: "100%" }}
      />
      <div className="historyLegend">
        <p>
          Last Updated:<span id="lastUpdated"></span>{" "}
        </p>
        <p>
          Sources:{" "}
          <a
            href="https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
            target="_blank"
          >
            COVID-19 Data Repository by the Center for Systems Science and
            Engineering (CSSE) at Johns Hopkins University
          </a>
        </p>
      </div>
    </Layout>
  );
};

export default HistoryPage;

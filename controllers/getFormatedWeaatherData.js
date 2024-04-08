const { DateTime } = require("luxon");
const getWeatherData = require("../controllers/getWeatherData");
const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, pressure, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;

  const { main: details, icon } = weather[0];
  return {
    lon,
    lat,
    temp,
    feels_like,
    temp_max,
    temp_min,
    pressure,
    humidity,
    name,
    dt,
    sunrise,
    sunset,
    country,
    speed,
    details,
    icon,
  };
};





const formattedForecastWeather = (data) => {
  const { list, city } = data;

  

  const daily = list.map((d) => {
    return {
      title: formatToLocalTime(d.dt, city.timezone,'ccc'),
      temp: d.main.temp,
      icon: makeIconURL(d.weather[0].icon),
    };
  });

  

  const today = new Date().toLocaleDateString(undefined, { weekday: "long" }).slice(0, 3);


  // Filter and map the forecast data
  const filteredForecast = daily.reduce((acc, cur) => {
    // Skip data for the current day
    if (cur.title === today) return acc;

    // Check if data for this day is already added
    if (!acc[cur.title]) {
      acc[cur.title] = cur; // Add the first data point for this day
    }

    return acc;
  }, {});

  const filteredForecastArray = Object.values(filteredForecast);
  

  return { filteredForecastArray };
};

const formatToLocalTime = (
  secs,
  zone,
  format = "cccc, dd LLL yyyy' | Local time:'hh:mm a'"
) => {
  const dateTime = DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

  return dateTime;
}




const makeIconURL = (iconId) =>
  `https://openweathermap.org/img/wn/${iconId}@2x.png`;

const getFomatedWeatherdataBycity = async (req, res) => {
  try {
    if (!req.params.city || !req.params.units) {
      return res.json({ success: false, mag: "send all fields" });
    }

    const searchParams = { q: req.params.city, units: req.params.units };
    const formattedCurrentWeather = await getWeatherData(
      "weather",
      searchParams
    );

    const formatteddata = formatCurrentWeather(formattedCurrentWeather);

    const { lat, lon, dt } = formatteddata;

    const ForecastWeather = await getWeatherData("forecast", {
      lat,
      lon,
      units: req.params.units,
    });

    const fomateedForcastedData = formattedForecastWeather(ForecastWeather, dt);

    const finalData = {
      ...formatteddata,
      ...fomateedForcastedData,
      icon: makeIconURL(formatteddata.icon),
    };


    return res.json({ success: true, data: finalData });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: "Internal Error" });
  }
};


const getFomatedWeatherdataBylat = async (req, res) => {
  try {
    if (!req.params.lat || !req.params.lon || !req.params.units) {
      return res.json({ success: false, mag: "send all fields" });
    }

    const searchParams = { lat: req.params.lat,lon: req.params.lon, units: req.params.units };
    const formattedCurrentWeather = await getWeatherData(
      "weather",
      searchParams
    );

    const formatteddata = formatCurrentWeather(formattedCurrentWeather);

    const { lat, lon} = formatteddata;

    const ForecastWeather = await getWeatherData("forecast", {
      lat,
      lon,
      units: req.params.units,
    });

    const fomateedForcastedData = formattedForecastWeather(ForecastWeather);

    const finalData = {
      ...formatteddata,
      ...fomateedForcastedData,
      icon: makeIconURL(formatteddata.icon),
    };


    return res.json({ success: true, data: finalData });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: "Internal Error" });
  }
};
module.exports = {getFomatedWeatherdataBycity,getFomatedWeatherdataBylat};

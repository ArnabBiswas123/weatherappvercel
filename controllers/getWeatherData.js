const getWeatherData = async (infoType, searchParams) => {
  try {
    const Base_Url = process.env.BASE_URL;
    const AppId = process.env.API_KEY;
    const url = new URL(Base_Url + "/" + infoType);
    url.search = new URLSearchParams({ ...searchParams, appid: AppId });
    
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
module.exports = getWeatherData;

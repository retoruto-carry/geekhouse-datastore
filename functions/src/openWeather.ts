import {Weather,WeatherResponse} from "./type";
import {api} from "./api"

export const getWeather = async (lat:string,lon:string,apiKey:string): Promise<Weather | null> => {
    try {
        const data = await api<WeatherResponse>(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=ja&exclude=minutely,hourly&units=metric`);
        const daily =  data.daily[0];
        return {
            sunrise:new Date(daily.sunrise*1000),
            sunset:new Date(daily.sunset*1000),
            temp:{
                min:daily.temp.min,
                max:daily.temp.max,
            },
            pressure:daily.pressure,
            humidity:daily.humidity,
            weather:{
                description:daily.weather[0].description,
                iconUrl:`https://openweathermap.org/img/wn/${daily.weather[0].icon}@4x.png`
            },
            updateTime:new Date(daily.dt*1000)
        }
    }catch (e) {
        console.error(e);
    }
    return null;
}


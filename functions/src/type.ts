export type Alert = {
  triggerDayOfWeek: [boolean]
  triggerHour: number
  enabled: boolean
  message: string
  image: string
  createdAt: Date
}

export type Weather = {
  sunrise: Date
  sunset: Date
  temp: {
    min:number
    max:number
  }
  pressure: number
  humidity: number
  weather: {
    description:string
    iconUrl:string
  }
  updateTime: Date
}

export type WeatherResponseDaily = {
  dt: number
  sunrise: number
  sunset: number
  temp: {
    day: number
    min: number
    max: number
    night: number
    eve: number
    morn: number
  }
  feels_like: {
    day: number
    night: number
    eve: number
    morn: number
  }
  pressure: number
  humidity: number
  dew_point: number
  wind_speed: number
  wind_deg: number
  weather: [
    {
      id: number
      main: string,
      description: string,
      icon: string
    }
  ]
  clouds: number
  pop: number
  uvi: number
}

export type WeatherResponse = {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  current:{
    dt: number
    sunrise: number
    sunset: number
    temp:number
    feels_like: number
    pressure: number
    humidity: number
    dew_point: number
    uvi: number
    clouds: number
    visibility: number
    wind_speed: number
    wind_deg: number
    weather:[
      {
        id: number
        main: string,
        description: string,
        icon: string
      }
    ]
  }
  daily:[
      WeatherResponseDaily
  ]
}

export type Signage = {
  url: string
  durationMillisecond: number
}
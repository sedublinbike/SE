
# coding: utf-8

# In[ ]:

import sqlalchemy as sqla
from sqlalchemy import create_engine
import traceback
import glob
import os
from pprint import pprint
import simplejson as json
import requests
import time
import datetime
import pymysql
# from IPython.display import display

APIKEY = "*******************************"
api_key = "*****************************"
NAME = "Dublin"
STATIONS_URI = "https://api.jcdecaux.com/vls/v1/stations"
URI="dbbikes12.c5cm18ftdu4w.eu-west-1.rds.amazonaws.com"
PORT="3306"
DB="dbbike12"
USER="se12"
PASSWORD="software"

engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URI, PORT, DB),echo=True)
#now = datetime.datetime.now()
#otherStyleTime = now.strftime("%Y-%m-%d_%H:%M:%S")

def stations_to_db(text):
    stations = json.loads(text)
#     print(type(stations), len(stations))
    now = datetime.datetime.now()
    otherStyleTime = now.strftime("%Y-%m-%d_%H:%M:%S")
    for station in stations:
        wtlat = station.get('position').get('lat')
        wtlng = station.get('position').get('lng')
        base_url = "http://api.openweathermap.org/data/2.5/weather?"
        coordinate = "lat={my_lat}&lon={my_lng}".format(my_lat=wtlat,my_lng=wtlng)        
        WEATHER_URI = base_url + "appid=" + api_key + "&" + coordinate + "&units=metric"
        k = requests.get(WEATHER_URI)
        weather = json.loads(k.text)
        forecast_url = "http://api.openweathermap.org/data/2.5/forecast?"
        FORECAST_URI = forecast_url + "appid=" + api_key + "&" + coordinate + "&units=metric"
        l = requests.get(FORECAST_URI)
        forecast = json.loads(l.text) 
        vals = (station.get('number'),int(station.get('available_bikes')), int(station.get('available_bike_stands')), int(station.get('banking')), station.get('bike_stands'), station.get('status'), weather['weather'][0]['description'],weather['weather'][0]['icon'],weather['main']['temp'],weather['main']['humidity'],weather['wind']['speed'],forecast['list'][0]['weather'][0]['description'],forecast['list'][0]['main']['temp'],forecast['list'][0]['weather'][0]['icon'],otherStyleTime)
        engine.execute("insert into station values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", vals)
    return
  
def main():
    while True:
        try:
            r = requests.get(STATIONS_URI, params={"apiKey": APIKEY,"contract": NAME})
            stations_to_db(r.text)
            time.sleep(5*60)
        except:
            print(traceback.format_exc())
            if engine is None:
                return
main()

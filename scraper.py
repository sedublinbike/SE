
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
import MySQLdb
import pymysql
from IPython.display import display

APIKEY = "8e9d2b248d3b27756984b6054e3c5983d7fa824b"
NAME = "Dublin"
STATIONS_URI = "https://api.jcdecaux.com/vls/v1/stations"
URI="dbbikes12.c5cm18ftdu4w.eu-west-1.rds.amazonaws.com"
PORT="3306"
DB="dbbike12"
USER="se12"
PASSWORD="software"

engine = create_engine("mysql+mysqldb://{}:{}@{}:{}/{}".format(USER, PASSWORD, URI, PORT, DB),echo=True)
now = datetime.datetime.now()
otherStyleTime = now.strftime("%Y-%m-%d_%H:%M:%S")

def stations_to_db(text):
    stations = json.loads(text)
#     print(type(stations), len(stations))
    
    for station in stations:
        vals = (station.get('number'), int(station.get('available_bikes')), int(station.get('available_bike_stands')), int(station.get('banking')), station.get('bike_stands'), station.get('status'), otherStyleTime)
        engine.execute("insert into station values(%s,%s,%s,%s,%s,%s,%s)", vals)

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


{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "import sqlalchemy as sqla\n",
    "from sqlalchemy import create_engine\n",
    "import traceback\n",
    "import glob\n",
    "import os\n",
    "from pprint import pprint\n",
    "import simplejson as json\n",
    "import requests\n",
    "import time\n",
    "import datetime\n",
    "import MySQLdb\n",
    "import pymysql\n",
    "from IPython.display import display\n",
    "\n",
    "APIKEY = \"8e9d2b248d3b27756984b6054e3c5983d7fa824b\"\n",
    "NAME = \"Dublin\"\n",
    "STATIONS_URI = \"https://api.jcdecaux.com/vls/v1/stations\"\n",
    "URI=\"dbbikes12.c5cm18ftdu4w.eu-west-1.rds.amazonaws.com\"\n",
    "PORT=\"3306\"\n",
    "DB=\"dbbike12\"\n",
    "USER=\"se12\"\n",
    "PASSWORD=\"software\"\n",
    "\n",
    "engine = create_engine(\"mysql+mysqldb://{}:{}@{}:{}/{}\".format(USER, PASSWORD, URI, PORT, DB),echo=True)\n",
    "now = datetime.datetime.now()\n",
    "otherStyleTime = now.strftime(\"%Y-%m-%d_%H:%M:%S\")\n",
    "\n",
    "def stations_to_db(text):\n",
    "    stations = json.loads(text)\n",
    "    print(type(stations), len(stations))\n",
    "    \n",
    "    for station in stations:\n",
    "        print(station)\n",
    "        vals2 = (station.get('address'), int(station.get('available_bikes')), int(station.get('available_bike_stands')), otherStyleTime)\n",
    "        engine.execute(\"insert into availability values(%s,%s,%s,%s)\", vals2)\n",
    "    for station in stations:\n",
    "        print(station)\n",
    "        vals = (station.get('address'), int(station.get('banking')), station.get('bike_stands'), station.get('status'), otherStyleTime)\n",
    "        engine.execute(\"insert into station values(%s,%s,%s,%s,%s)\", vals)    \n",
    "    return\n",
    "\n",
    "  \n",
    "def main():\n",
    "    while True:\n",
    "        try:\n",
    "            r = requests.get(STATIONS_URI, params={\"apiKey\": APIKEY,\"contract\": NAME})\n",
    "            stations_to_db(r.text)\n",
    "            time.sleep(5*60)\n",
    "        except:\n",
    "            print(traceback.format_exc())\n",
    "            if engine is None:\n",
    "                return\n",
    "main()"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.7.2"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}

from flask import Flask, render_template, jsonify ,request    
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import datetime
# flask edition:0.12
import time
from app_.translate_time import TimeStampToTime,get_FileModifyTime
from prediction.predictor import predict_,create_predict_set
import joblib

class Config(object):
    """setting the configuration"""
    # use sqlalchemy configure the connection
    # format:mysql://username:password@host:port/database_name
#     SQLALCHEMY_DATABASE_URI = "{}://{}:{}@{}:{}/{}".format(     )

    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://se12:software@dbbikes12.c5cm18ftdu4w.eu-west-1.rds.amazonaws.com:3306/dbbike12"
    # set sqlalchemy track the data automatically
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    

# create an object
app = Flask(__name__)

app.config.from_object(Config)

db = SQLAlchemy(app)

class StationFix(db.Model):
    """create a model class for station_fix(static data )"""
    __tablename__ = "station_fix"

    address = db.Column(db.String(256))
    number = db.Column(db.Integer, unique=True, primary_key=True)
    contract_name = db.Column(db.String(256))
    bonus = db.Column(db.String(256))
    position_lat = db.Column(db.Integer)
    position_lng = db.Column(db.Integer)
    station_relationship = db.relationship("Station", backref="stationfix")
      
    def to_dict(self):
        '''Convert the object into dictionary'''
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
        
    
class Station(db.Model):
    """create an Model class for station(dynamic data )"""
    __tablename__ = "station"

    number = db.Column(db.Integer, db.ForeignKey("station_fix.number"), unique=True, primary_key=True,)
    available_bikes = db.Column(db.Integer)
    available_bike_stands = db.Column(db.Integer)
    banking = db.Column(db.Integer)
    bike_stands = db.Column(db.Integer)
    status = db.Column(db.String(256))
    weather = db.Column(db.String(256))
    icon = db.Column(db.String(256))
    temperature = db.Column(db.String(256))
    humidity = db.Column(db.String(256))
    wind_speed = db.Column(db.String(256))
    future_weather = db.Column(db.String(256))
    future_temperature = db.Column(db.String(256))
    future_icon = db.Column(db.String(256))
    time = db.Column(db.String(256), unique=True, primary_key=True)


    def to_dict(self):
        '''Convert the object into dictionary'''
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}



# this route simply serves the homepage
@app.route('/')
def index():
    return render_template('HomePage.html')

# this route simply serves the map page
@app.route('/all_stations')
def show_map():
    return render_template('map.html')

# this route simply serves the search page
@app.route('/search')
def search_page():
    return render_template('Search.html')

# this route simply serves the map page
@app.route('/prediction')
def prediction_page():
    return render_template('Prediction.html')

# this route simply serves the route page
@app.route('/route')
def show_teaminfo():
    return render_template('Route.html')

#query all the station and return 'json' file 
@app.route("/stations")
def get_all_stations():
    '''this function is designed to get all stations information and the latest available stands and bikes'''
    stations = StationFix.query.all()
    stations_recent = db.session.query(Station.number,Station.available_bikes,Station.available_bike_stands).order_by(Station.time.desc()).limit(113).all()
    station_li = []
    #match the latest information with the stations
    for station in stations:
        station = station.to_dict()
        for row in stations_recent:
            if station['number'] == row[0]:
                station['available_bikes']=row[1]
                station['available_bike_stands']=row[2]
                break
        station_li.append(station)   
    return jsonify(stations=station_li)

#query single station and return 'json' file )
 
@app.route("/available/<int:station_id>") 
def get_stations(station_id):
    '''this function is designed to get information for a special station'''
    station_recent = Station.query.filter_by(number=station_id).order_by(Station.time.desc()).first().to_dict()
    
    #because of the alternation of daylight saving time and winter time,and the time has not be changed by API,so we change it by hand
    recent_time = datetime.datetime.strptime(station_recent['time'],"%Y-%m-%d_%H:%M:%S")+datetime.timedelta(hours=1)
    if recent_time<datetime.datetime.now():
        station_recent['time'] = str(recent_time)
    
    #return the mean of available bike stands and bikes together
    rows = db.session.query(Station.time,Station.available_bike_stands,Station.available_bikes).filter_by(number=station_id).order_by(Station.time.desc()).all()
    df = pd.DataFrame(rows,columns = ['time','available_bikes','available_bike_stands'])
    df['time'] = pd.to_datetime(df['time'],format="%Y-%m-%d_%H:%M:%S")
    df['weekday'] = [i.weekday()+1 for i in df['time']]
    df['hours'] = [i.hour for i in df['time']]
    df = df.set_index('time',drop = True)
    
    df1 = df.groupby(df['weekday']).mean()
    df2 = df.groupby(df['hours']).mean()
    df3 = df.groupby([df['weekday'],df['hours']]).mean()
    
    li_bike_weekly = list(df1['available_bikes'])
    li_bike_stands_weekly = list(df1['available_bike_stands'])
    
    li_bike_hourly = [list(df2['available_bikes'])]+[list(df3.loc[i,'available_bikes']) for i in range(1,8)]
    li_bike_stands_hourly = [list(df2['available_bike_stands'])]+[list(df3.loc[i,'available_bike_stands']) for i in range(1,8)]

    
    return jsonify(station_recent=station_recent, li_bike_weekly=li_bike_weekly,li_bike_stands_weekly=li_bike_stands_weekly,li_bike_hourly=li_bike_hourly,li_bike_stands_hourly=li_bike_stands_hourly) 


# weather,no use at this moment,for future
@app.route("/weather/<int:station_id>")
def get_weather(station_id):
    '''return the weather for a special staion'''
    row = db.session.query(Station.weather, Station.icon, Station.temperature, Station.humidity, Station.wind_speed, Station.future_weather, Station.future_temperature, Station.future_icon, Station.time).filter_by(number=station_id).order_by(Station.time.desc()).first()
    return jsonify(station_wheather = row)

@app.route("/predict")
def predict():
    '''this function is designed to predict the available bike stands for the stations'''
    file_modify_time =  get_FileModifyTime('dbbikes_model.pkl')
    now = TimeStampToTime(time.time())
    
    #if the model trained already is not match the day predict,then the function will train the model again and predict
    if now == file_modify_time:
        model = joblib.load("dbbikes_model.pkl")
    else:
        rows = db.session.query(Station.number,Station.available_bikes,Station.available_bike_stands,Station.weather,Station.temperature,Station.time).filter(Station.weather.isnot(None)).order_by(Station.time.desc()).all()
        df = pd.DataFrame(rows,columns = ['number','available_bikes','available_bike_stands','weather','temperature','time'])
        predict_(df)
        model = joblib.load("dbbikes_model.pkl")
        
    #create a dictionary to store the index of address in the list which will be sent back to front-end,it is 
    stations = StationFix.query.all()
    station_li = {}
    for station in stations:
        station = station.to_dict()
        station_li[station['address']]=station['number']
    for station in station_li.keys():
        if station_li[station]<=19:
            station_li[station] = station_li[station]-2
        else:
            station_li[station] = station_li[station]-3
            
            
    df = create_predict_set()
    prediction_data = list(model.predict(df))
    
    #return a list-like dictionary for convenience of aquiring the data by the front-end
    prediction_data_final = [[[prediction_data[k]*1.0 for k in range(i*113*24+j*24,i*113*24+j*24+24)] for j in range(113)] for i in range(7)]
    return jsonify(prediction_data = prediction_data_final,stations_li = station_li)

@app.route("/predict_by_id")
def predict_by_id():
    '''this function is designed to predict the available bike stands for the stations'''
    file_modify_time =  get_FileModifyTime('dbbikes_model.pkl')
    now = TimeStampToTime(time.time())
    station_id = request.args.get('station_id')
    weekday = request.args.get('weekday')
    #if the model trained already is not match the day predict,then the function will train the model again and predict
    if now == file_modify_time:
        model = joblib.load("dbbikes_model.pkl")
    else:
        rows = db.session.query(Station.number,Station.available_bikes,Station.available_bike_stands,Station.weather,Station.temperature,Station.time).filter(Station.weather.isnot(None)).order_by(Station.time.desc()).all()
        df = pd.DataFrame(rows,columns = ['number','available_bikes','available_bike_stands','weather','temperature','time'])
        predict_(df)
        model = joblib.load("dbbikes_model.pkl")
        
    #create a dictionary to store the index of address in the list which will be sent back to front-end,it is 
    stations = StationFix.query.all()
    station_li = {}
    for station in stations:
        station = station.to_dict()
        station_li[station['address']]=station['number']
    for station in station_li.keys():
        if station_li[station]<=19:
            station_li[station] = station_li[station]-2
        else:
            station_li[station] = station_li[station]-3
            
            
    df = create_predict_set()
    prediction_data = list(model.predict(df))
    
    #return a list-like dictionary for convenience of aquiring the data by the front-end
    prediction_data_final = [[[prediction_data[k]*1.0 for k in range(i*113*24+j*24,i*113*24+j*24+24)] for j in range(113)] for i in range(7)]
    return jsonify(prediction_data = prediction_data_final,stations_li = station_li)
if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=5000)

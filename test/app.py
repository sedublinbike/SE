
from flask import Flask, render_template, jsonify ,request    
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
from sklearn.linear_model import LinearRegression
# flask edition:0.12

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


#weather class,for future
# class Weather(db.Model):
    

# this route simply serves the map page
@app.route('/')
def root():
    return render_template('test.html')
 
#query all the station and return 'json' file 
@app.route("/stations", methods=["GET","POST"])
def get_all_stations():
    # query the database
    stations = StationFix.query.all()
    stations_recent = db.session.query(Station.number,Station.available_bikes,Station.available_bike_stands).order_by(Station.time.desc()).limit(113).all()
    station_li = []
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
    station_recent = Station.query.filter_by(number=station_id).order_by(Station.time.desc()).first().to_dict()
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
    row = db.session.query(Station.weather, Station.icon, Station.temperature, Station.humidity, Station.wind_speed, Station.future_weather, Station.future_temperature, Station.future_icon, Station.time).filter_by(number=station_id).order_by(Station.time.desc()).first()
    return jsonify(station_wheather = row)

@app.route("/predict/<int:station_id>")
def predict(station_id):
    # now we can call various methods over model as as:
    # Let X_test be the feature for which we want to predict the output
    rows = Station.query.filter_by(number=station_id).order_by(Station.time.desc()).all()
    row = []
    for i in rows:
        row.append(i.to_dict())
#     rows = db.session.query(Station.weather, Station.icon, Station.temperature, Station.humidity, Station.wind_speed, Station.future_weather, Station.future_temperature, Station.future_icon, Station.time).filter_by(number=station_id).order_by(Station.time.desc()).all()
#     result = model.predict(X_test)
#     return jsonify(result)
    return jsonify(row = row)

if __name__ == '__main__':
    app.run(debug=True)


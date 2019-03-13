
from flask import Flask, render_template, jsonify     
from flask_sqlalchemy import SQLAlchemy


class Config(object):
    """setting the configuration"""
    # use sqlalchemy configure the connection
    # format:mysql://username:password@host:port/database_name
#     SQLALCHEMY_DATABASE_URI = "{}://{}:{}@{}:{}/{}".format(     )

    SQLALCHEMY_DATABASE_URI = "mysql://se12:software@dbbikes12.c5cm18ftdu4w.eu-west-1.rds.amazonaws.com:3306/dbbike12"
    # set sqlalchemy track the data automatically
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    
    # setting map_key
#     MAPS_APIKEY 
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
    time = db.Column(db.String(256), unique=True, primary_key=True)
    
    def to_dict(self):
        '''Convert the object into dictionary'''
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# this route simply serves 'static/index.html'
@app.route('/')
def root():
    return render_template('index.html')
#     return render_template('index.html', MAPS_APIKEY=app.config["MAPS_APIKEY"]) 
 
 
@app.route("/station", methods=["GET", "POST"])
def index():
    # query the database
    stations = StationFix.query.all()
    station_li = []
    for station in stations:
        station_li.append(station.to_dict())
#     return render_template("test_stations.html", stations=stations)
    return jsonify(stations=station_li)


@app.route("/available/<int:station_id>") 
def get_stations(station_id):
    data = []
    rows = Station.query.filter_by(number=station_id).order_by(Station.time.desc()).all()
    row_recent = rows[0].to_dict()

    for row in rows:
        data.append(row.available_bikes)
    
    return jsonify(row_recent=row_recent, available=data) 


if __name__ == '__main__':
    app.run(debug=True)


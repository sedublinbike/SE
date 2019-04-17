import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeRegressor
from sklearn.feature_extraction import DictVectorizer
import joblib

def predict_(df):
    df['time'] = pd.to_datetime(df['time'],format="%Y-%m-%d_%H:%M:%S")
    df['weekday'] = [i.weekday() for i in df['time']]
    df['hour']  = [i.hour for i in df['time']]
    df = df[df['weather'].isin(['broken clouds', 'clear sky', 'drizzle', 'few clouds', 'fog','heavy intensity rain', 'light intensity drizzle','light intensity drizzle rain', 'light intensity shower rain','light rain', 'mist', 'moderate rain', 'overcast clouds','scattered clouds', 'shower rain'])]
    df = df.set_index('time',drop = False).groupby('number').resample('H').first().ffill().reset_index(drop=True).set_index('time',drop = True)
    df[['weather','hour','weekday','number']]=df[['weather','hour','weekday','number']].astype('category')
    df = df.reset_index(drop=True)
    y = df['available_bike_stands']
    X = df[['number','weather','hour','temperature','weekday']]
    predict_model(X,y)    


def predict_model(features,target):
    dicv = DictVectorizer(sparse = False)
    X = dicv.fit_transform(features.to_dict(orient="records"))
    y = target
    dtr = DecisionTreeRegressor(max_depth = 15)
    dtr.fit(X,y)
    joblib.dump(dtr,'dbbikes_model.pkl')


    
def create_predict_set():
    
    stations =[i for i in range(2,116) if i !=20]
    weekdays =[i for i in range(7)] 
    dic1 = {}
    dic1['number'] = [station  for weekday in weekdays for station in stations for i in range(24)]
    dic1['hour'] = [i  for weekday in weekdays for station in stations for i in range(24)]
    dic1['weekday'] = [weekday for weekday in weekdays for station in stations for i in range(24)]
    dic1['weather'] = ['broken clouds', 'clear sky', 'drizzle', 'few clouds','broken clouds','broken clouds', 'clear sky', 'drizzle', 'few clouds','broken clouds', 'clear sky', 'drizzle', 'few clouds', 'fog',
       'heavy intensity rain', 'light intensity drizzle',
       'light intensity drizzle rain', 'light intensity shower rain',
       'light rain', 'mist', 'moderate rain', 'overcast clouds',
       'scattered clouds', 'shower rain'] *113*7
    dic1['temperature'] =[5.0,5.0,5.0,5.0,5.0,5.0,6.0,7.0,8.0,9.0,10.0,11.0,11.0,11.0,11.0,11.0,11.0,10.0,9.0,8.0,7.0,6.0,6.0,5.0]*113*7
    df = pd.DataFrame(dic1)
    df[['weather','hour','weekday','number']]=df[['weather','hour','weekday','number']].astype('category')
    dicv = DictVectorizer(sparse = False)
    df = dicv.fit_transform(df.to_dict(orient="records"))    
    return df
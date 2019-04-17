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


    
def create_predict_set(station,weekday):
    dic = {}
    dic['hour'] = [i for i in range(24)]
    dic['weekday'] = [weekday for i in range(24)]
    dic['number'] = [station for i in range(24)]
    dic['weather'] = ['broken clouds', 'clear sky', 'drizzle', 'few clouds','broken clouds','broken clouds', 'clear sky', 'drizzle', 'few clouds','broken clouds', 'clear sky', 'drizzle', 'few clouds', 'fog',
       'heavy intensity rain', 'light intensity drizzle',
       'light intensity drizzle rain', 'light intensity shower rain',
       'light rain', 'mist', 'moderate rain', 'overcast clouds',
       'scattered clouds', 'shower rain'] 
    dic['temperature'] =[6.00 for i in range(24)]
    df = pd.DataFrame(dic)
    df[['weather','hour','weekday','number']]=df[['weather','hour','weekday','number']].astype('category')
    dicv = DictVectorizer(sparse = False)
    df = dicv.fit_transform(df.to_dict(orient="records"))    
    return df
import pandas as pd
from sqlalchemy import create_engine

fileName = 'https://geo.sv.rostock.de/download/opendata/rettungswachen/rettungswachen.csv'
data = pd.read_csv(fileName, delimiter=',', decimal=',')

data = data[
    [
        'uuid',
        'latitude',
        'longitude',
        'bezeichnung',
        'traeger_bezeichnung',
        'traeger_art',
        'website',
    ]
]

data = data.astype({
    'uuid': str,
    'latitude': float,
    'longitude': float,
    'bezeichnung': str,
    'traeger_bezeichnung': str,
    'traeger_art': str,
    'website': str,
})

data = data[data['latitude'].apply(lambda input: input >= -90 and input <= 90)]
data = data[data['longitude'].apply(lambda input: input >= -90 and input <= 90)]

data['publiclyFunded'] = data['traeger_art'].map(
    lambda input: input == 'öffentlich'
)

sinkFile = 'rescuestations.db'
tableName = 'rescuestations'
engine = create_engine(f'sqlite:///{sinkFile}')

data.to_sql(tableName, engine, if_exists='replace', index=False)

engine.dispose()
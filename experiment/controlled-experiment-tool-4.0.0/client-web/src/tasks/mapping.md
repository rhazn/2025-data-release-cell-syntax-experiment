# HTTPExtractor (ZIP)
```
sourceUrl = 'https://daten.wuppertal.de/Soziales/Schulen_EPSG25832_CSV.zip'
destinationName = 'Schulen_EPSG25832_CSV.zip'
response = urlopen(sourceUrl)
output = open(destinationName, 'wb')
shutil.copyfileobj(response, output)
output.close()

zipFile = zipfile.ZipFile(destinationName, 'r')
```

# ArchiveInterpreter -> ... -> CSVInterpreter
```
fileName = 'Schulen_EPSG25832_CSV.csv'
file = zipFile.extract(fileName)
os.remove(destinationName)

data = pd.read_csv(file, delimiter=';')
os.remove(fileName)
```

# CellWriter
```
data = data.rename(
    columns={
        'ID': 'id',
        'Name': 'name',
        'Adresse': 'address',
        'Schultyp': 'schoolType',
        'Traeger': 'runBy',
    }
)
```

# TableInterpreter
```
data = data[
    ['id', 'name', 'address', 'schoolType', 'runBy']
].astype({
    'id': int,
    'name': str,
    'address': str,
    'schoolType': str,
    'runBy': str,
})
```

# SQLiteLoader
```
sinkFile = 'schools.db'
tableName = 'schools'
engine = create_engine(f'sqlite:///{sinkFile}')

data.to_sql(tableName, engine, if_exists='replace', index=False)

engine.dispose()
```
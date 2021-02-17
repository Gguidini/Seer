import pyrebase
import datetime
import json

# import os
# Know where is the json file:
# print(os.listdir())

config = {
  "apiKey": "AIzaSyBJ40d8bNo2x_reFNjfxCUinALH24Rzh9Y",
  "authDomain": "seer-3ec9b.firebaseapp.com",
  "databaseURL": "https://seer-3ec9b-default-rtdb.firebaseio.com",
  "storageBucket": "seer-3ec9b.appspot.com"
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()


file = open('report_paths.json', 'r')

# delete previous data in test
try:
  db.child('live_report').remove()
except:
  print('didn`t need to remove previous database')

time_start = datetime.datetime.now()
print(f"started at {time_start}")
for index, line in enumerate(file):
  json_data = json.loads(line)
  db.child('live_report').child(index).set(json_data)

time_end = datetime.datetime.now()
print(f'ended at {time_end}')
print(f'it took {time_end - time_start}')

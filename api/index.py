from flask import Flask, request, jsonify, make_response 
app = Flask(__name__)

from urllib.parse import unquote
import datetime
import requests
import pandas as pd 
from pandas import json_normalize
import json
import matplotlib.pyplot as plt
from dateutil import parser
import numpy as np
from datetime import date, timedelta
import calendar
import holidays

import urllib.request

# Import for parsing URLs (urllib.parse)
from urllib.parse import urlparse, urlunparse  # Example functions


def count_week_weekend_and_bank_holidays(start_date, end_date,excluded_ranges=[],country="GB"):
  """
  This function counts the number of weekend days and UK bank holidays between two dates.

  Args:
      start_date (date): The start date (inclusive).
      end_date (date): The end date (inclusive).
       excluded_ranges (list of tuples, optional): A list of tuples representing excluded date 
                                                        ranges [(start_date1, end_date1), ...]. Defaults to [].
      country (str, optional): The country for which to get bank holidays. Defaults to "GB" (UK).

  Returns:
      tuple: A tuple containing the number of weekend days and bank holidays.
  """

  # Ensure start_date is before or equal to end_date
  if start_date > end_date:
    print("Start date must be before or equal to end date.")
    raise ValueError("Start date must be before or equal to end date.")

  num_weekend_days = 0
  num_bank_holidays = 0
  num_excluded_days = 0
  num_work_days = 0
  weekend_days = [calendar.SATURDAY, calendar.SUNDAY]
  
  correctRange = range((end_date - start_date).days + 1)

  # Iterate through each day in the date range (inclusive)
  for day in correctRange:    
    current_date = start_date + timedelta(days=day)
    excluded = False
    
    print("check for excluded dates")
    #check for excluded
    for excluded_start, excluded_end in excluded_ranges:
      if excluded_start <= current_date <= excluded_end:
        excluded = True
        break
    
    print("check for weekend dates")
    # Check for weekend day
    if current_date.weekday() in weekend_days:
      num_weekend_days += 1
    elif current_date not in holidays.UK(years=current_date.year) and not excluded:
      num_work_days += 1

    # Check for bank holiday (using holidays library)
    if current_date in holidays.UK(years=current_date.year):
      num_bank_holidays += 1
      
    if excluded and current_date not in holidays.UK(years=current_date.year) and current_date not in holidays.UK(years=current_date.year) :
      num_excluded_days += 1

  print("returning")
  return num_weekend_days, num_bank_holidays, num_work_days, num_excluded_days


# Define some helper functions
## 
# Get (in raw json) the stats on the card that include blocked, and time in lanes
##
def get_code_health(id,auth):  
  print("getting card " + id)
  print("with auth" + auth)
  cardHistoryUrl = "https://codecomputerlove.leankit.com/io/reporting/cardHealth/" +id
  response = requests.get(cardHistoryUrl, 
      headers = {
       
        "Content-Type": "application/json",
        "Authorization": auth,
      },
    )
  print("got response")
  print(response)
  return response.json()

##
# Get in raw json all the details of a card (excluding its 'health')
##
def get_additional_details(id):
  cardUrl = "https://codecomputerlove.leankit.com/io/card/" +id
  response = requests.get(cardUrl, 
      headers = {
       
        "Content-Type": "application/json",
        "Authorization": auth,
      },
    );
  return response.json()

def additional_details(row):
  return get_additional_details(row['id'])

##
# get counted days between start and end dates, using only business days
##
def actual_time (row, startColName, endColName): 
  # wrap in try catch to account to ignore bad data 
  try:
    startTimeStr = row[startColName]
    endTimeStr = row[endColName]
    actual_start = parser.parse(startTimeStr)
    actual_fin = parser.parse(endTimeStr)  
    # count days between start and end dates, using only business days 
    return np.busday_count(actual_start.date(), actual_fin.date())
  except Exception as varname:
    return 0 

def dataframe_to_excluded_ranges(laneHistoryFrame):
  """
  This function converts a DataFrame containing lane history data 
  into a list of tuples representing excluded date ranges.

  Args:
      laneHistoryFrame (pandas.DataFrame): The DataFrame containing lane history data.

  Returns:
      list of tuples: A list of tuples where each tuple represents an excluded date range 
                       (start_date, end_date).
  """

  print("filter for none acive")
  # Filter for rows where laneClassType is not "active"
  filtered_df = laneHistoryFrame[laneHistoryFrame['laneClassType'] != "active"]
  print(filtered_df)
  print("calc zip")
  # Assuming 'startDate' and 'endDate' columns exist in the DataFrame
  zip_list = zip(filtered_df['entryDateTime'], filtered_df['exitDateTime'])
  print(zip_list)
  print("calc excluded range")
  excluded_ranges = list(zip_list)
  
  print(excluded_ranges)

  return excluded_ranges
  
  
##
# Get (in series form) stats about the card with "id" including
# totalDaysInBlocked
# totalDaysInExcludedLanes (using 'exludedLanes' param)
# history_success include info on whether the call was successful
# id (for merging)
# Also include a column for each lane card was in, with how many days it was in it
##
def get_card_history(id, excludeLanes,auth):
  totalDaysInBlocked = 0
  totalDaysInExcludedLanes = 0

  # wrap in try catch to account to ignore bad data
  try:
    print("attempting history function")
    #global curRecord
    #print("attempting record" + curRecord)
    #curRecord = curRecord+1
    #message = f"Now  on {curRecord}/{numrecords}"
    #print(message, end='\r');
    json = get_code_health(id,auth)    
    
    print("Card " + id)
    print("----CARD JSON-----")
    print(json)
    print("----EOF CARD JSON-----")
    blockedHistoryFrame = json_normalize(json, 'blockedHistory')
    
    print("blockedHistoryFrame: ")
    print(blockedHistoryFrame)
 

    # populate totalDaysInBlocked
    if(not blockedHistoryFrame.empty):
      blockedHistoryFrame['blocked_time'] = blockedHistoryFrame.apply (lambda row: actual_time(row,'blockedDate','unblockedDate'),axis=1)
      totalDaysInBlocked = blockedHistoryFrame['blocked_time'].sum()

    # calculate totalDaysInExcludedLanes
    laneHistoryFrame = json_normalize(json, 'laneHistory')
    
   
    print("laneHistoryFrame: ")
    print(laneHistoryFrame)
    print("filtered history: ")
    laneHistoryFrame = laneHistoryFrame[laneHistoryFrame['laneClassType'] == "active"]
    excluded_ranges = dataframe_to_excluded_ranges(laneHistoryFrame)
    print(laneHistoryFrame)
    
    print("Lets find time diff")
    # Find row with earliest entry time
    df = laneHistoryFrame.copy()
    
    
    
    print("merged history: ")
    
    # Group by title, sum daysInLane, keep other columns using first value
    laneHistoryFrame = laneHistoryFrame.groupby('title')['daysInLane'].sum().reset_index()
    print(laneHistoryFrame)
    
    # special lanes...
   
    if 'LSB' in excludeLanes:
      lanes = laneHistoryFrame['title']
      print("Special lanes...")
      print(lanes)
      # Find lanes with months or "w/c"
      months = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"}
      lanes_to_exclude = [
          lane for lane in lanes
          if any(month.lower() in lane.lower() for month in months) or "w/c" in lane.lower()
      ]
      
      # Add the identified lanes to excludeLanes
      excludeLanes.extend(lanes_to_exclude)
    
    print("excludeLanes:")
    print(excludeLanes)   
    print("What lanes are excluded....")
    
    print("Time difference")
    print(df)
    
    print("filter")
    filtered_df = df[~df['title'].isin(excludeLanes)]
    print(filtered_df)
    df = filtered_df
    row_earliest_entry = df[df['entryDateTime'] == df['entryDateTime'].min()]
    
    # Find row with latest exit time
    row_latest_exit = df[df['exitDateTime'] == df['exitDateTime'].max()]
    
    print("row_earliest_entry")
    print(row_earliest_entry['entryDateTime'])
    print("row_latest_exit")
    print(row_latest_exit['exitDateTime'])
    
    # Ensure datetime format for both columns
    row_latest_exit['exitDateTime'] = pd.to_datetime(row_latest_exit['exitDateTime'])
    row_earliest_entry['entryDateTime'] = pd.to_datetime(row_earliest_entry['entryDateTime'])
    
    print("row_earliest_entry")
    print(row_earliest_entry['entryDateTime'])
    print("row_latest_exit")
    print(row_latest_exit['exitDateTime'])
    
    startDate = row_earliest_entry['entryDateTime'].iloc[0]
    endDate =  row_latest_exit['exitDateTime'].iloc[0]
    
    # Calculate the difference (assuming exit time is always after entry time)
    time_difference = str(endDate - startDate)
    
    #TODO here we need to be smarter and loop the rows, either counting the days that count or using the "excluded_ranges" param below
    
    # Print the time difference
    print("time_difference")
    print(time_difference)
    
    print("calculating holidays")
    num_weekends, num_holidays, num_work_days, num_excluded_days = count_week_weekend_and_bank_holidays(startDate, endDate,excluded_ranges)
    
    print(laneHistoryFrame['title'].isin(excludeLanes))

    if(not laneHistoryFrame.empty):
      totalDaysInExcludedLanes = laneHistoryFrame.loc[laneHistoryFrame['title'].isin(excludeLanes), 'daysInLane'].sum()
    
    print("totalDaysInExcludedLanes")
    print(totalDaysInExcludedLanes)
    
   
    
    
    #assinged to X days?
    
    # create series with summed data
    series = pd.Series({'totalDaysInBlocked': totalDaysInBlocked,   'totalDaysInExcludedLanes': totalDaysInExcludedLanes, "timeInActiveLanes":time_difference, "timeInActiveLanesExcludingBlockedWeekendAndHolidays":num_work_days,  "num_weekends":num_weekends, "num_bank_holidays":num_holidays, "history_success":"true", "id":id  });

    # turn original laneHistoryFrame into a series with just daysInLane for each lane with "In: " prefix
    finalDf = laneHistoryFrame[['title', 'daysInLane']]
    series2 = finalDf.set_index('title')['daysInLane']
    series2 = series2.add_prefix('In: ')

    # drop duplicates (not sure why this happens but it does)
    df1 = series.loc[~series.index.duplicated(keep='first')]
    df2 = series2.loc[~series2.index.duplicated(keep='first')]
    # merge the two series into one series
    result = pd.concat([df1, df2], axis=0)
    
    
    return result
  except:
    return pd.Series({'totalDaysInBlocked': totalDaysInBlocked,   'totalDaysInExcludedLanes': totalDaysInExcludedLanes, "history_success":"false", "id":id })
    raise

def card_history(id,auth):
  return get_card_history(id, excludeLanesFromTime,auth)

##
# Calculate "real time" using the data we have
##
def calculated_time(row):
  try:
    time = row['timeInDays']
    blocked_time = row['totalDaysInBlocked']
    excluded_time = row['totalDaysInExcludedLanes']
    return time - blocked_time - excluded_time
  except:
    return -999


def main(API_Key, laneId,excludeLanesFromTime,date_from,date_to):
    ## 
    #   Main code
    ##   


    # Get Leankit details

    numrecords = 0
    curRecord = 0

    # Create Auth header
    auth = "Bearer "+API_Key

    # Create cards API request
    url = "https://codecomputerlove.leankit.com/io/card?lanes=" +laneId

    #excludeLanesFromTime = ["Client Acceptance","Ready For Release"]
    # Example
    #Client Acceptance;Ready For Release
    print("you are excluding:")
    print(excludeLanesFromTime)


    # Make actual request to leankit for initial data
    response = requests.get(url, 
        headers = {
        
            "Content-Type": "application/json",
            "Authorization": auth,
        },
        )



    # Turn response into dataframe, taking only the columns we want
    jsonDf = pd.json_normalize(response.json(), "cards")
    print("Json Table is")
    print(jsonDf);
    dataFrame = jsonDf[['size', 'id','title','actualStart','actualFinish']]
    
    print("corrected table is")
    print(dataFrame)
        
    # Add some extra columns and print the basic data
    dataFrame["timeInDays"] = dataFrame.apply (lambda row: actual_time(row,'actualStart','actualFinish'), axis=1)
    dataFrame["actualStart"] = dataFrame.apply (lambda row: parser.parse(row['actualStart']), axis=1)


    # Put some space away from warnings (TODO fix warnings)
    print("---------\/ ignore \/------------ ")

    # Convert the dates to datetime objects and remove timezone
    dataFrame['actualDate'] = pd.to_datetime(dataFrame['actualStart'])
    dataFrame['actualDate'] = dataFrame['actualDate'].dt.date;

    # Put some space away from warnings (TODO fix warnings)
    print("---------^ ignore ^------------ ")
    print(" ")
    print(" ")

    # Show current data
    print("All card data without calculated time")
    print(dataFrame)
    print(" ")
    
    print("date_from")       
    print(date_from)
    print("date_to")
    print(date_to)
    
    

    # Create a new column called "is_in_range" and set it to True if the "actualDate" is between the "dateFrom" and "dateTo" values, and False otherwise
    dataFrame['is_in_range'] = (dataFrame['actualDate'] >= date_from) & (dataFrame['actualDate'] <= date_to)

    # Filter the dataframe based on the "is_in_range" column and print it
    filtered_df = dataFrame[dataFrame['is_in_range']]
    print("selected date range data without calculated time")
    print(filtered_df)

    ##
    #  Now start the heavy lifting...
    ##
    print("Data with calculated time....")
    print("please wait")
    print("....")
    numrecords=len(filtered_df)
    # get history for each card to calculate time in lanes and blocked time
    historyDataFrame = filtered_df.id.apply (lambda id: get_card_history(id, excludeLanesFromTime, auth))
    print("Done")

    # merge with original frame
    finalDataFrame =  pd.merge(historyDataFrame,dataFrame)
    finalDataFrame["calculated time"] = finalDataFrame.apply (lambda row: calculated_time(row), axis=1)


    # reorder columns put the most important ones next to each other at the far right
    cols_at_end = ['timeInDays',  'totalDaysInBlocked', 'totalDaysInExcludedLanes', 'timeInActiveLanesExcludingBlockedWeekendAndHolidays', 'size', 'calculated time']
    finalDataFrame = finalDataFrame[[c for c in finalDataFrame if c not in cols_at_end] 
            + [c for c in cols_at_end if c in finalDataFrame]]

    # Create the boxplot
    #boxplot = finalDataFrame.boxplot(column='calculated time', by="size") 


    # display the boxplot
    #plt.show()
    return finalDataFrame



@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"
    
@app.route('/api/lk/card/<card_id>', methods=['GET'])
def handle_card_request(card_id):
    try:
        api_key = request.args.get('api_key')
        API_Key = api_key
        auth = "Bearer "+API_Key
        excludeLanes_str = request.args.get('excludeLanes')
        excludeLanes_list = [item[1:-1] for item in unquote(excludeLanes_str).split(',')]

        print("Excluded lanes")
        print(excludeLanes_list)
        print("getting card history")
        df = get_card_history(card_id,excludeLanes_list,auth)
        data_dict = df.to_dict()  # 'records' for list of dictionaries
        json = jsonify(data_dict)
        print("card success")
        return json
    except Exception as e:
        print("card Fail")
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/health', methods=['GET'])
def handle_health_request():    
    return 'Web App with Python Flask!'
 
@app.route('/api/lk', methods=['GET'])
def handle_request():
    """Handles API requests with 'api_key' and 'id' parameters."""
    api_key = request.args.get('api_key')
    lane_id = request.args.get('id')
    dateToStr = request.args.get('dateTo')
    dateFromStr = request.args.get('dateFrom')
    excludeLanes_str = request.args.get('excludeLanes')
    asCsv = request.args.get('asCsv')
    excludeLanes_list = [item[1:-1] for item in unquote(excludeLanes_str).split(',')]
  
    
    print("-------sent details--------")
    
    print("dateTo")
    print(dateToStr)
    print("dateFrom")
    print(dateFromStr)
    
    
    dateTo = datetime.datetime.strptime(dateToStr, "%d-%m-%Y").date()
    dateFrom = datetime.datetime.strptime(dateFromStr, "%d-%m-%Y").date()
    
    print("dateTo")
    print(dateTo)
    print("asCsv")
    print(asCsv)
    print("dateFrom")
    print(dateFrom)
    print("excluded lanes")
    print(excludeLanes_list)  
    print("------- EOF sent details--------")
    
    if not api_key or not lane_id:
      return jsonify({'error': 'Missing required parameters: api_key and id'}), 500
      
    
    try:
      final_table = main(api_key, lane_id,excludeLanes_list,dateFrom,dateTo)
      
      print("Success")
      print(final_table)
      data_dict = final_table.fillna(0).to_dict(orient='records')  # 'records' for list of dictionaries
                    
            
           
      
      if asCsv:
        filename = f"lk data  {dateFrom} to {dateTo}.csv"     
        for c in r'[]/\;,><&*:%=+@!#^()|?^':
          filename = filename.replace(c,'')
        
        #csv_string = finalDataFrame.to_csv(path_or_buf=filename, sep=",")
        #print("data table saved in: " + filename)  
        csv_string = final_table.to_csv()        
        response = make_response(csv_string)
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = f"attachment; filename={filename}"  # Optional: Set filename
        print("CSV Success")
        return response
      else:
        json = jsonify(data_dict)
        print("as Json")
        print(json)
        return json
    except Exception as e:
      print("Fail")
      return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
  app.run(debug=True)
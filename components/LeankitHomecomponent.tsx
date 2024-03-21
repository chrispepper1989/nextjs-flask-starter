'use client'
import LaneStatsForm from "./LaneStatsForm";
import React, {useState} from "react";
import LaneStatsChart from "@/components/LaneStatsChart";
import LaneStatsTable from "@/components/LaneStatsTable";
import {buildURL} from "@/components/common";

interface LeankitHomecomponentParams {
    initialAPIKey: string | undefined;
    initialLaneId: string | undefined;
}

function LeankitHomecomponent({initialAPIKey, initialLaneId}: LeankitHomecomponentParams) {
  const [data, setData] = useState<any[]>(
      [{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Mon, 18 Mar 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Mon, 18 Mar 2024 11:29:42 GMT","calculated time":0.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2110808517","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":0,"timeInActiveLanes":0,"timeInDays":0,"title":"Basket and Checkout - SF data ","totalDaysInBlocked":0,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Wed, 28 Feb 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Wed, 28 Feb 2024 09:53:57 GMT","calculated time":-2.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2101122622","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":3,"timeInActiveLanes":0,"timeInDays":0,"title":"Q2 [FE] Consent Mode","totalDaysInBlocked":2,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Wed, 31 Jan 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Wed, 31 Jan 2024 11:52:27 GMT","calculated time":-5.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2085211478","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":3,"timeInActiveLanes":0,"timeInDays":0,"title":"Q2 [FE] New Promotion","totalDaysInBlocked":5,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Wed, 14 Feb 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Wed, 14 Feb 2024 10:59:10 GMT","calculated time":-10.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2093421895","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":1,"timeInActiveLanes":0,"timeInDays":0,"title":"Q2 [Analytics] Consent Mode","totalDaysInBlocked":10,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Wed, 03 Jan 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Wed, 03 Jan 2024 14:15:56 GMT","calculated time":-12.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2067735060","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":0,"timeInActiveLanes":0,"timeInDays":0,"title":"[FE] Static IP - Update beacons page to Optional add ons","totalDaysInBlocked":12,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Thu, 25 Jan 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Thu, 25 Jan 2024 10:26:56 GMT","calculated time":-4.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2081333898","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":0,"timeInActiveLanes":0,"timeInDays":0,"title":"[FE] Static IP - Update basket summary with static IP","totalDaysInBlocked":4,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Wed, 14 Feb 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Wed, 14 Feb 2024 09:47:49 GMT","calculated time":0.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2093442562","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":0,"timeInActiveLanes":0,"timeInDays":0,"title":"[FE] Static IP - Checkout page ","totalDaysInBlocked":0,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Wed, 31 Jan 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Wed, 31 Jan 2024 11:41:04 GMT","calculated time":-10.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2085204526","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":0,"timeInActiveLanes":0,"timeInDays":0,"title":"[FE] Static IP - Feature flag","totalDaysInBlocked":10,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Tue, 27 Feb 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Tue, 27 Feb 2024 10:04:41 GMT","calculated time":-2.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2100381307","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":0,"timeInActiveLanes":0,"timeInDays":0,"title":"[Analytics] Static IP tracking","totalDaysInBlocked":2,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Wed, 24 Jan 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Wed, 24 Jan 2024 16:48:34 GMT","calculated time":0.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2080123807","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":0,"timeInActiveLanes":0,"timeInDays":0,"title":"[BE] Static IP - Add static IP to flow","totalDaysInBlocked":0,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Tue, 09 Jan 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Tue, 09 Jan 2024 13:37:51 GMT","calculated time":-32.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2070592603","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":0,"timeInActiveLanes":0,"timeInDays":0,"title":"[Analytics] Investigation into tracking customer portal","totalDaysInBlocked":32,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Wed, 14 Feb 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Wed, 14 Feb 2024 10:18:53 GMT","calculated time":-1.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2093449584","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":0,"timeInActiveLanes":0,"timeInDays":0,"title":"[Analytics] Add pixel for TikTok","totalDaysInBlocked":1,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Tue, 06 Feb 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Tue, 06 Feb 2024 09:43:36 GMT","calculated time":-8.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2085303498","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":0,"timeInActiveLanes":0,"timeInDays":0,"title":"[Analytics] Add pixel for Meta ","totalDaysInBlocked":8,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Tue, 23 Jan 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Tue, 23 Jan 2024 11:54:30 GMT","calculated time":-3.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2078794846","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":1,"timeInActiveLanes":0,"timeInDays":0,"title":"[FE] Add Business to navigation ","totalDaysInBlocked":3,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Thu, 18 Jan 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Thu, 18 Jan 2024 13:19:45 GMT","calculated time":0.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2075516020","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":2,"timeInActiveLanes":0,"timeInDays":0,"title":"[Design] Static IP journey","totalDaysInBlocked":0,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":61.86,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Thu, 18 Jan 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Thu, 18 Jan 2024 15:08:54 GMT","calculated time":-61.86,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"true","id":"2076389668","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":0,"timeInActiveLanes":"0 days 00:00:55.570000","timeInDays":0,"title":"[Call] Static IP call","totalDaysInBlocked":0,"totalDaysInExcludedLanes":61.86},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Mon, 15 Jan 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Mon, 15 Jan 2024 15:34:11 GMT","calculated time":0.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2073906029","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":0,"timeInActiveLanes":0,"timeInDays":0,"title":"[Call/Investigation] Promotional codes on website ","totalDaysInBlocked":0,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Mon, 15 Jan 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Mon, 15 Jan 2024 15:35:01 GMT","calculated time":0.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2073905591","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":0,"timeInActiveLanes":0,"timeInDays":0,"title":"[Investigation] Static IP","totalDaysInBlocked":0,"totalDaysInExcludedLanes":0.0},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":68.02,"In: Measurement":0.0,"In: Sprint w/c 20th March":2.9,"actualDate":"Tue, 09 Jan 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Tue, 09 Jan 2024 13:37:21 GMT","calculated time":-70.92,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"true","id":"2070592859","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":0,"timeInActiveLanes":"0 days 00:03:40.440000","timeInDays":0,"title":"[Hotjar] Exit Intent Survey analysis","totalDaysInBlocked":0,"totalDaysInExcludedLanes":70.92},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":69.08,"In: Measurement":0.0,"In: Sprint w/c 20th March":7.79,"actualDate":"Wed, 03 Jan 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Wed, 03 Jan 2024 14:52:13 GMT","calculated time":-76.87,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"true","id":"2067771513","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":0,"timeInActiveLanes":"0 days 00:00:02.916000","timeInDays":0,"title":"[Call/Investigation] Promotional codes on website ","totalDaysInBlocked":0,"totalDaysInExcludedLanes":76.87},{"In: Client acceptance":0.0,"In: Des / Dev / Content":0.0,"In: January":0.0,"In: Measurement":0.0,"In: Sprint w/c 20th March":0.0,"actualDate":"Tue, 09 Jan 2024 00:00:00 GMT","actualFinish":0,"actualStart":"Tue, 09 Jan 2024 13:08:26 GMT","calculated time":0.0,"daysInActiveLanesExcludingBlockedWeekendAndHolidays":0.0,"history_success":"false","id":"2070569234","is_in_range":true,"num_bank_holidays":0.0,"num_weekends":0.0,"size":0,"timeInActiveLanes":0,"timeInDays":0,"title":"[Call/Investigation] Static IP","totalDaysInBlocked":0,"totalDaysInExcludedLanes":0.0}]

  ); // Replace `any` with your actual data type

    
  const handleFormSubmit = (formData: { apiKey: string; id: string; dateFrom: string; dateTo: string; excludeLanes: string[] }, getAsCSV:boolean) => {
    // Implement your logic to fetch data from the backend API using the provided form data (formData)
    // This example demonstrates a simulated API call with a delay
      const url = buildURL(formData,getAsCSV);
      if(getAsCSV)
      {


          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'data.csv'); // Set filename
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url); // Clean up temporary URL
          /*
          const downloadCSV = (csvContent: string) => {
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'data.csv'); // Set filename
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url); // Clean up temporary URL
          };
          
          fetch(url).then(async response => {
              downloadCSV(await response.text());
          })*/
        
      }
      else
      {
          fetch(url)
              .then((response) => response.json())
              .then((fetchedData) => setData(fetchedData))
              .catch((error) => console.error(error));
      }
      
   
     
  };

  return (
    <div>
      <h1>Lane Stats</h1>
      <LaneStatsForm onSubmit={handleFormSubmit} initialAPIKey={initialAPIKey} initialLaneId={initialLaneId}></LaneStatsForm>
     
        {data.length > 0 && (
        <>
          <h2>Data Table</h2>
          <LaneStatsTable data={data} />
          <h2>Box Plot of Days (Excl. Blocked, Wknds, Holidays)</h2>
          <LaneStatsChart data={data} />
        </>
      )}
    </div>
  );
}

export default LeankitHomecomponent;
'use client'
import LaneStatsForm from "./LaneStatsForm";
import React, {useState} from "react";
import LaneStatsTable from "@/components/LaneStatsTable";
import {buildURL} from "@/components/common";

interface LeankitHomecomponentParams {
    initialAPIKey: string | undefined;
    initialLaneId: string | undefined;
}

function LeankitHomecomponent({initialAPIKey, initialLaneId}: LeankitHomecomponentParams) {
  const [data, setData] = useState<any[]>(
      []
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

        </>
      )}
    </div>
  );
}

export default LeankitHomecomponent;
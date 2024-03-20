import React from 'react';
import {ILaneStats} from "@/components/ILaneStats";
import './LaneStatsForm.css'; // Import the CSS file
function LaneStatsTable({ data }: { data: ILaneStats[] }) {
    if (!data || data.length === 0) {
        return <p>No data available.</p>;
    }

    const tableHeaders = Object.keys(data[0]);

    
    return (
        <table>
            <thead>
            <tr>
                {tableHeaders.map((header) => (
                    <th key={header}>{header}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((item,index) => (
                <tr key={item.id+"-"+index}>

                   

                    {/*  Dynamically render table cells based on object keys*/} 
                    {Object.keys(item).map((key) => (
                        <td key={key}>{`${item[key]}`}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default LaneStatsTable;

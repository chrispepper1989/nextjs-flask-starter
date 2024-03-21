'use client'
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './LaneStatsForm.css'; // Import the CSS file
import { WithContext as ReactTags } from 'react-tag-input';
import {buildURL} from "@/components/common";
import {clearPreviewData} from "next/dist/server/api-utils";



interface LaneStatsFormData {
    apiKey: string;
    id: string;
    dateFrom: string;
    dateTo: string;
    excludeLanes: string[];
}

interface LaneStatsFormParams {
    onSubmit: (data: LaneStatsFormData, getAsCSV:boolean) => void;
    initialAPIKey?: string;
    initialLaneId?: string;
}

function LaneStatsForm({onSubmit, initialAPIKey, initialLaneId}: LaneStatsFormParams) {

    const today = new Date();
    const lanes = localStorage.getItem('excludeLanes')?.split(',') || [];
    console.log(lanes)
    const [formData, setFormData] = useState<LaneStatsFormData>({
        apiKey: initialAPIKey || localStorage.getItem('apiKey') || '',
        id: initialLaneId || localStorage.getItem('id')  || '',
        dateFrom: new Date(today.getFullYear(), today.getMonth() ,1).toISOString(),
        dateTo: new Date(today.getFullYear(), today.getMonth() +  1,1).toISOString(),
        excludeLanes: lanes
    });

    const savedTags = lanes.map(item => {
        return {
            id: item,
            text: item
        };
    });
    
    const [tags, setTags] = React.useState(savedTags);

   useEffect(() => {
        localStorage.setItem('apiKey', formData.apiKey);
        localStorage.setItem('id', formData.id);
        localStorage.setItem('dateFrom', formData.dateFrom);
        localStorage.setItem('dateTo', formData.dateTo);
        localStorage.setItem('excludeLanes', formData.excludeLanes.join(','));
    }, [formData]);


    const handleMonth = (monthOffset:number) => {
        const today = new Date();
        setFormData({
            ...formData,
            dateFrom: new Date(today.getFullYear(), today.getMonth()+monthOffset, 1).toISOString(),
            dateTo: new Date(today.getFullYear(), today.getMonth() + monthOffset+ 1,1).toISOString(),
        });
    };
    const suggestions = ["LSB", "Client Acceptance"].map(item => {
        return {
            id: item,
            text: item
        };
    });

    const KeyCodes = {
        comma: 188,
        enter: 13
    };

    const delimiters = [KeyCodes.comma, KeyCodes.enter];
    
    const handleLastMonth = () => handleMonth(-1)
    const handleThisMonth = () => handleMonth(0)

    const handleExcludeLaneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            excludeLanes: checked ? [...prevData.excludeLanes, value] : prevData.excludeLanes.filter((lane) => lane !== value),
        }));
        const tagValue = {id:value,text: value};
        setTags( prevTags => 
         checked ? [...prevTags, tagValue] : prevTags.filter( x => x.id != tagValue.id))
    };


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        formData.excludeLanes = tags.map(x => x.id);
        
        onSubmit(formData,false); // Call the provided onSubmit function with form data
    };


   /* react tags */
    const updateTags = (newTags) =>
    {
        setTags(newTags);    
        setFormData((prevData) => ({
            ...prevData,
            excludeLanes:  newTags.map(x => x.id),
        }));
    }
    const handleDelete = i => {
        updateTags(tags.filter((tag, index) => index !== i));
    
    };

    const handleAddition = tag => {
        updateTags([...tags, tag]);

 
    };

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render  
        updateTags(newTags);
    };

    const handleTagClick = index => {
      
      
    };

    return (
        <form className="lane-stats-form" onSubmit={handleSubmit}>
            <label htmlFor="apiKey">API Key:</label>
            <input type="text" id="apiKey" value={formData.apiKey}
                   onChange={(e) => setFormData({...formData, apiKey: e.target.value})}/>
            <p>Get the api key from your leankit account (click your profile pic -> API keys)</p>
            <label htmlFor="id">Lane ID:</label>
            <input type="text" id="id" value={formData.id}
                   onChange={(e) => setFormData({...formData, id: e.target.value})}/>
            <p>this needs to be the lane id of your "done" lane (click profile pic -> API mode, then click your done
                lane :) )</p>
            <label htmlFor="dateFrom">Date From:</label>
            <DatePicker selected={Date.parse(formData.dateFrom)}
                        onChange={(date) => setFormData({...formData, dateFrom: date.toISOString()})}
                        dateFormat="yyyy-MM-dd"/>

            <label htmlFor="dateTo">Date To:</label>
            <DatePicker selected={Date.parse(formData.dateTo)}
                        onChange={(date) => setFormData({...formData, dateTo: date.toISOString()})}
                        dateFormat="yyyy-MM-dd"/>
            <div className={"vertical"}>
                <button type="button" onClick={handleThisMonth}>This Month</button>
                <button type="button" onClick={handleLastMonth}>Last Month</button>
            </div>
            <label>Exclude Lanes:</label>
            {/*
            <div>
                <label htmlFor="excludeClientAcceptance">Client Acceptance</label>
                <input type="checkbox" id="excludeClientAcceptance" value="Client acceptance"
                       checked={formData.excludeLanes.includes('Client acceptance')}
                       onChange={handleExcludeLaneChange}/>

            </div>
            <div>
                <label htmlFor="excludeLsb">LSB</label>
                <input type="checkbox" id="excludeLsb" value="LSB" checked={formData.excludeLanes.includes('LSB')}
                       onChange={handleExcludeLaneChange}/>

            </div>
             {/* Add more checkboxes for other exclude lanes if needed */}


            <div className={"tags"}>
                <ReactTags
                    tags={tags.filter(x => x.id != "LSB")}
                    suggestions={suggestions}
                    delimiters={delimiters}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    handleDrag={handleDrag}
                    handleTagClick={handleTagClick}
                    inputFieldPosition="bottom"
                    autocomplete

                />
            </div>
            <div>
                <label htmlFor="excludeLsb">Exclude lanes like "Sprint w/c" or "January/Febuary/etc" </label>
                <input type="checkbox" id="excludeLsb" value="LSB" checked={formData.excludeLanes.includes('LSB')}
                       onChange={handleExcludeLaneChange}/>

            </div>
            <br/>

            <button type="submit">{"Generate Chart (WIP)"}</button>
            <a href={buildURL(formData, true)} download="data.csv"  rel="noopener noreferrer" target="_blank"> Download As C.S.V</a>
            <br/><br/><br/>
        </form>
    );
}

export default LaneStatsForm;
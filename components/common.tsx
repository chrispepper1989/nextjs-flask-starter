export function buildURL(formData: {
    apiKey: string;
    id: string;
    dateFrom: string;
    dateTo: string;
    excludeLanes: string[]
},getAsCSV:boolean = false) {
    function formatDateToDesired(dateString: string): string {
        // Use try-catch for robustness in case of invalid date format
        try {
            const originalDate = new Date(dateString);
            const desiredFormat = "dd-MM-yyyy"; // Adjust format as needed (e.g., "MM-dd-yyyy")
            return originalDate.toLocaleDateString(undefined, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).replaceAll('/', '-');
        } catch (error) {
            console.error("Error parsing date:", error);
            return "Invalid Date"; // Or handle the error differently
        }
    }

    const url = `/api/lk?api_key=${formData.apiKey}&id=${formData.id}&dateFrom=${formatDateToDesired(formData.dateFrom)}&dateTo=${formatDateToDesired(formData.dateTo)}&excludeLanes=${formData.excludeLanes}&asCsv=${getAsCSV}}`
    console.log(url)
    return url;
}
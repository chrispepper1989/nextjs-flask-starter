export interface ILaneStats {
    "In: Client acceptance": number;
    "In: Des / Dev / Content": number;
    // ... other properties from your JSON
    actualDate: string;
    actualFinish: number;
    actualStart: string;
    calculatedTime: number;
    daysInActiveLanesExcludingBlockedWeekendAndHolidays: number;
    history_success: string;
    id: string;
    is_in_range: boolean;
    num_bank_holidays: number;
    num_weekends: number;
    size: number;
    timeInActiveLanes: number;
    timeInDays: number;
    title: string;
    totalDaysInBlocked: number;
    totalDaysInExcludedLanes: number;
}
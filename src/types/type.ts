export interface Destination {
    date: Date | string;
    name: string;
    notes: string;
    googleMapLink: string;
  }
  
  export interface Trip {
    id: string;
    tripName: string;
    startDate: Date;
    endDate: Date;
    budget: number;
    destinations: Destination[]; // 配列で囲む
  }
export interface Destination {
    date: Date | string;
    name: string;
    cost: number | string;
    notes: string;
    googleMapLink: string;
  }
  
  export interface Trip {
    id: string;
    tripName: string;
    startDate: Date;
    endDate: Date;
    budget: number;
    createdBy: string;
    shareWith: string[];
    notes: string
    destinations: Destination[];
  }

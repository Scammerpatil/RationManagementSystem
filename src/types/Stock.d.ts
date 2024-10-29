export interface Stock {
  month:
    | "January"
    | "February"
    | "March"
    | "April"
    | "May"
    | "June"
    | "July"
    | "August"
    | "September"
    | "October"
    | "November"
    | "December";
  wheat: number;
  rice: number;
  bajra: number;
  sugar: number;
  corn: number;
  oil: number;
}

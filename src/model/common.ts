export type InputItemProps = {
    title: string;
    onInputChange: (value: string) => void;
    value?: number | string;
    placeholder?: string;
  };
  
export type OptionType = {
  value: number;
  label:string
}
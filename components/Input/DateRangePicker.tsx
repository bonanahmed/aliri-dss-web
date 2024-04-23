import { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import { PropBasic } from '@/types/general';

interface PropDateRangePicker extends PropBasic {
  value: (Date|undefined)[];
  onChange: (start: Date, end: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  ref?: any;
  error?: string;
}

const DateRangePickerInput = (props: PropDateRangePicker) => {
  const { value, onChange, className='', error} = props
  const [selectionRange, setDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  })

  const handleSelect = (ranges:any) => {
    setDate((prev) => ({...prev, ...ranges.selection}))
    onChange(ranges.selection.startDate, ranges.selection.endDate)
  }

  useEffect(() => {
    if (value[0] === undefined){
      setDate((prev) => ({...prev, startDate: new Date(), endDate: new Date()}))
    }
  },[value])

  return (
    <>
      <DateRange 
        {...props}
        className={`w-min mx-auto ${className}`}
        ranges={[selectionRange]}
        onChange={handleSelect}
      />
      {error && <div className="text-aktired-30 text-xs">{error}</div>}
    </>
  )
};

export default DateRangePickerInput;
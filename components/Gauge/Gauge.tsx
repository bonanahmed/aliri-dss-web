import * as React from "react";
import {
  LinearGaugeComponent,
  AxesDirective,
  AxisDirective,
  PointersDirective,
  PointerDirective,
} from "@syncfusion/ej2-react-lineargauge";
export const Gauge = ({
  title,
  max,
  min,
  value,
  intervalMajor,
  intervalMinor,
}: {
  title: string;
  max: number;
  min: number;
  value: number;
  intervalMajor: number;
  intervalMinor: number;
}) => {
  return (
    <LinearGaugeComponent title={title}>
      <AxesDirective>
        <AxisDirective
          minimum={min}
          maximum={max}
          majorTicks={{ interval: intervalMajor }}
          minorTicks={{ interval: intervalMinor, color: "red" }}
        >
          <PointersDirective>
            <PointerDirective value={value} type="Marker"></PointerDirective>
          </PointersDirective>
        </AxisDirective>
      </AxesDirective>
    </LinearGaugeComponent>
  );
};

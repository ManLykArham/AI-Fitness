import { AreaChart, Card, type EventProps } from "@tremor/react";
import { useState } from "react";

interface DataItem {
  month: string;
  intake: number;
  burned: number;
}

export default function DashboardPage() {
  const [value, setValue] = useState<DataItem | null>(null);
  // Assuming we are tracking calorie intake and burn over the last six months
  const data = [
    { month: "January", intake: 2200, burned: 2000 },
    { month: "February", intake: 2300, burned: 1900 },
    { month: "March", intake: 2400, burned: 2000 },
    { month: "April", intake: 1100, burned: 1900 },
    { month: "June", intake: 2600, burned: 2000 },
    { month: "July", intake: 2700, burned: 2100 },
  ];
  // Get today's date to display at the top
  const today = new Date().toLocaleDateString();
  const handleValueChange = (eventProps: EventProps) => {
    if (
      eventProps &&
      typeof eventProps.data === "object" &&
      "intake" in eventProps.data &&
      "burned" in eventProps.data
    ) {
      // Now that we've checked that 'intake' and 'burned' are keys in eventProps.data,
      // TypeScript should allow us to assert that eventProps.data is of type DataItem.
      const value = eventProps.data as DataItem;
      setValue(value);
    } else {
      // Handle the case where eventProps or eventProps.data is null/undefined
      // This could be resetting the state, showing an error, or other appropriate action
      setValue(null);
    }
  };

  return (
    <main>
      <div className="my-10">
        <Card>
          <AreaChart
            data={data}
            index="month"
            categories={["intake", "burned"]}
            onValueChange={handleValueChange}
          />
        </Card>
        {value && (
          <div>
            <p>{`Month: ${value.month}`}</p>
            <p>{`Calorie Intake: ${value.intake}`}</p>
            <p>{`Calories Burned: ${value.burned}`}</p>
          </div>
        )}
      </div>
      {/* Additional cards and content can be added here */}
    </main>
  );
}

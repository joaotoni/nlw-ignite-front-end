import * as Checkbox from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";
import { api } from "../libs/axios";

interface HabitsListProps {
  date: Date;
  onCompleteChange: (complete: number) => void,
}

interface HabitsInfo {
  possibleHabits: Array<{
    id: string;
    title: string;
    created_at: string;
  }>;
  completeHabits: string[];
}

export function HabitList({ date, onCompleteChange }: HabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();
  useEffect(() => {
    api.get("day", {
        params: {
          date: date.toISOString(),
        },
      })
      .then((response) => {
        setHabitsInfo(response.data);
      });
  }, []);

  const isDateInPast = dayjs(date)
    .endOf('day')
    .isBefore(new Date())

  async function handleToggleHabit(habitId: string){
    const isHabitAlreadyCompleted = habitsInfo?.completeHabits.includes(habitId)
  
    await api.patch(`/habits/${habitId}/toggle`)

    let completeHabits: string[]=[]
    if(isHabitAlreadyCompleted){
      completeHabits = habitsInfo!.completeHabits.filter(id=> id != habitId)  
    } else{
      completeHabits = [...habitsInfo!.completeHabits, habitId]
    }

    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completeHabits,
    })

    onCompleteChange(completeHabits.length)
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map(habit => {
        
        
        return (
          <Checkbox.Root
            key={habit.id}
            onCheckedChange ={() => handleToggleHabit(habit.id)}
            checked={habitsInfo.completeHabits.includes(habit.id)}
            disabled={isDateInPast}
            className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors  group-focus:ring-2 group-focus:ring-violet-500 group-focus:ring-offset-2 group-focus:ring-offset-background">
              <Checkbox.Indicator className="">
                <Check size={20} className="text-white" />
              </Checkbox.Indicator>
            </div>
            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
              {habit.title}
            </span>
          </Checkbox.Root>
        );
      })}
    </div>
  );
}

import { useEffect, useState, type FC, type ReactElement } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import type { ITask } from "@/types/task.interface";
import { useUpdateTask } from "@/hooks/useUpdateTask.hook";
import { useQueryClient } from "@tanstack/react-query";

export const Task: FC<ITask> = (props: ITask): ReactElement => {
  const { title, description, status, priority, dueDate, _id } = props;
  const [progress, setProgress] = useState(false);
  const { mutate } = useUpdateTask();
  const queryClient = useQueryClient();

  const formattedDate = new Date(dueDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  useEffect(() => {
    if (status === "in-progress") {
      setProgress(true);
    }
  }, [status]);

  function handleProgressChange(value: boolean) {
    setProgress(value);
    if (_id) {
      mutate({ _id: _id, status: value ? "in-progress" : "todo" });
    }
    queryClient.invalidateQueries({
      queryKey: ["fetchTasks"],
      refetchType: "all",
    });
  }

  function handleTaskCompleted() {
    if (_id) {
      mutate({ _id: _id, status: "completed" });
    }
    queryClient.invalidateQueries({
      queryKey: ["fetchTasks"],
      refetchType: "all",
    });
  }

  return (
    <Card className="mb-8 w-full">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="basis-2/3 leading-8">{title}</CardTitle>
        <div>
          <Badge className="mr-2" variant="outline">
            {formattedDate}
          </Badge>
          {priority === "medium" && (
            <Badge className="bg-sky-800" variant="outline">
              {priority}
            </Badge>
          )}
          {priority === "high" && (
            <Badge className="bg-red-800" variant="outline">
              {priority}
            </Badge>
          )}
          {priority === "low" && (
            <Badge className="bg-green-800" variant="outline">
              {priority}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
      <CardFooter className="flex flex-row justify-between">
        <div className="flex flex-row items-center">
          <Switch
            id="in-progress"
            checked={progress}
            onCheckedChange={handleProgressChange}
          />
          <Label className="ml-4" htmlFor="in-progress">
            In Progress
          </Label>
        </div>
        <Button onClick={handleTaskCompleted}>Completed</Button>
      </CardFooter>
    </Card>
  );
};

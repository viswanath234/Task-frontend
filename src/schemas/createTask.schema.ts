import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .max(100, { message: "Title must be maximum 100 characters long" }),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  description: z
    .string()
    .max(500, { message: "Description must be maximum 500 characters long" }),
  status: z.enum(["todo", "in-progress", "completed"], {
    message: "Status is required",
  }),
  priority: z.enum(["low", "medium", "high"], {
    message: "Priority is required",
  }),
});

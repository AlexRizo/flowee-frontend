import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SubmitButton } from "~/components/dashboard/tasks/create-task/SubmitButton";
import { DateTimePicker } from "~/components/DateTimePicker";
import { SingleSelect } from "~/components/SingleSelect";
import { Button } from "~/components/ui/button";
import { FormControl, FormMessage } from "~/components/ui/form";
import { Form, FormLabel, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useCreateTaskContext } from "~/context/CreateTaskContext";
import { Priority } from "~/services/interfaces/tasks-service.interface";

export function meta() {
  return [
    {
      title: "Crear: solicitud especial | Flowee",
    },
  ];
}

const SpecialTask = () => {
  const { handleSetSpecialTask, step, nextStep } = useCreateTaskContext();
  
  return (
    <>

    </>
  );
};

export default SpecialTask;

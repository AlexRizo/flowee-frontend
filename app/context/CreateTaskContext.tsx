import { createContext, useContext, useState, type FC } from "react";
import {
  Priority,
  Status,
  Type,
} from "~/services/interfaces/tasks-service.interface";

const taskBase: TaskBase = {
  title: '',
  description: '',
  priority: Priority.LOW,
  status: Status.AWAIT,
  type: Type.SPECIAL,
  boardId: undefined,
  dueDate: undefined,
  referenceFiles: [],
  includeFiles: [],
}

const initialSpecialTask: SpecialTask = {
  ...taskBase,
  sizes: '',
  legals: '',
}



interface TaskBase {
  title: string;
  description: string;
  priority: Priority;
  status: Status.AWAIT;
  type: Type;
  boardId?: string;
  dueDate?: Date;
  referenceFiles: File[];
  includeFiles: File[];
}

interface SpecialTask extends TaskBase {
  // idea: string;
  sizes: string;
  legals: string;
}

interface DigitalTask extends TaskBase {}

interface PrintTask extends TaskBase {}

interface EcommerceTask extends TaskBase {}

type Steps = 1 | 2 | 3 | 4 | 5;

interface CreateContextType {
  specialTask: SpecialTask;
  digitalTask: DigitalTask | null;
  printTask: PrintTask | null;
  ecommerceTask: EcommerceTask | null;
  step: Steps;
  nextStep: () => void;
  previousStep: () => void;
  handleSetStep: (step: Steps) => void;
  handleSetSpecialTask: (data: Partial<SpecialTask>) => void;
  handleReset: () => void;
}

const CreateTaskContext = createContext<CreateContextType | undefined>(undefined);

interface CreateTaskProviderProps {
  children: React.ReactNode;
}

export const CreateTaskProvider: FC<CreateTaskProviderProps> = ({
  children,
}) => {
  const [specialTask, setSpecialTask] = useState<SpecialTask>(initialSpecialTask);
  const [digitalTask, setDigitalTask] = useState<DigitalTask | null>(null);
  const [printTask, setPrintTask] = useState<PrintTask | null>(null);
  const [ecommerceTask, setEcommerceTask] = useState<EcommerceTask | null>(null);
  const [step, setStep] = useState<Steps>(1);

  const handleSetSpecialTask = (data: Partial<SpecialTask>): void => {
    setSpecialTask(prev => {
      if (!prev) return initialSpecialTask;

      return {
        ...prev,
        ...data,
      };
    });
  }

  const nextStep = (): void => {
    if (step === 5) return;
    setStep(prev => prev + 1 as Steps);
  }

  const previousStep = (): void => {
    if (step === 1) return;
    setStep(prev => prev - 1 as Steps);
  }

  const handleSetStep = (step: Steps): void => {
    if (step < 1 || step > 5) return;
    
    setStep(step);
  }

  const handleReset = (): void => {
    setSpecialTask(initialSpecialTask);
    setDigitalTask(null);
    setPrintTask(null);
    setEcommerceTask(null);
    setStep(1);
  }
  
  return (
    <CreateTaskContext.Provider
      value={
        {
          specialTask,
          digitalTask,
          printTask,
          ecommerceTask,
          handleSetSpecialTask,
          handleSetStep,
          nextStep,
          previousStep,
          step,
          handleReset,
        }
      }
    >
      {children}
    </CreateTaskContext.Provider>
  );
};

export const useCreateTaskContext = (): CreateContextType => {
  const ctx = useContext(CreateTaskContext);

  if (!ctx) throw new Error("useCreateTaskContext debe ser usado dentro de CreateTaskProvider");

  return ctx;
}
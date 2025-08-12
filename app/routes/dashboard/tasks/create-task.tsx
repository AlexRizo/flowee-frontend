import { ScrollText, Smartphone, Sparkles, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TaskTypeCard } from "~/components/dashboard/tasks/TaskTypeCard";
import { Button } from "~/components/ui/button";
import { useCreateTaskContext } from "~/context/CreateTaskContext";

export function meta() {
  return [
    {
      title: "Crear solicitud | Flowee",
    },
  ];
}

const types = [
  {
    id: 1,
    name: "Digital",
    path: "digital",
    description: "Redes sociales y CRM",
    icon: <Smartphone size={80} strokeWidth={1.5} />,
  },
  {
    id: 2,
    name: "Impresa",
    path: "impresa",
    description: "Espectaculares, pendones",
    icon: <ScrollText size={80} strokeWidth={1.5} />,
  },
  {
    id: 3,
    name: "Ecommerce",
    path: "ecommerce",
    description: "Banners, news, diseño web",
    icon: <Store size={80} strokeWidth={1.5} />,
  },
  {
    id: 4,
    name: "Especial",
    path: "especial",
    description: "Material distinto",
    icon: <Sparkles size={80} strokeWidth={1.5} />,
  },
];

const CreateTask = () => {
  const { nextStep, handleSetStep } = useCreateTaskContext();

  const [selectedType, setSelectedType] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    handleSetStep(1);
  }, [])

  const handleStart = () => {
    if (!selectedType) return;
    nextStep();
    navigate(
      `/solicitudes/nueva-solicitud/${
        types.find((type) => type.id === selectedType)?.path
      }`,
    );
  };

  return (
    <>
      <h1 className="text-center text-xl font-bold mb-8">
        Selecciona el tipo de solicitud
      </h1>
      <div role="grid" className="grid grid-cols-2 gap-4 w-max mx-auto">
        {types.map((type, index) => (
          <TaskTypeCard
            key={index}
            {...type}
            selected={selectedType}
            setSelected={setSelectedType}
          />
        ))}
      </div>
      <Button
        onClick={handleStart}
        disabled={!selectedType}
        size="lg"
        className="mx-auto w-67.5 h-15 mt-8 bg-violet-700 hover:bg-violet-800 text-xl font-bold"
      >
        Comenzar
      </Button>
    </>
  );
};

export default CreateTask;

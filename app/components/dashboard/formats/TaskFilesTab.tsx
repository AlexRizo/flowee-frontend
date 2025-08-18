import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { FilesTable } from "./FilesTable";
import { useEffect } from "react";
import type { TaskFile } from "~/services/interfaces/tasks-service.interface";

export const TaskFilesTab = ({
  referenceFiles,
  includeFiles,
}: {
  referenceFiles?: TaskFile[];
  includeFiles?: TaskFile[];
}) => {
  
  return (
    <Tabs defaultValue="reference">
      <TabsList className="w-full">
        <TabsTrigger value="reference">Referencias Gráficas</TabsTrigger>
        <TabsTrigger value="includes">Archivos para el Diseño</TabsTrigger>
      </TabsList>
      <TabsContent value="reference">
        <FilesTable files={referenceFiles} />
      </TabsContent>
      <TabsContent value="includes">
        <FilesTable files={includeFiles} />
      </TabsContent>
    </Tabs>
  );
};

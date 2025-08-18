import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { FilesTable } from "./FilesTable";

export const TaskFilesTab = () => {
  return (
    <Tabs defaultValue="reference">
      <TabsList className="w-full">
        <TabsTrigger value="reference">Referencias Gráficas</TabsTrigger>
        <TabsTrigger value="includes">Archivos para el Diseño</TabsTrigger>
      </TabsList>
      <TabsContent value="reference">
        <FilesTable />
      </TabsContent>
      <TabsContent value="includes">
        <FilesTable />
      </TabsContent>
    </Tabs>
  );
};

import { Terminal } from "lucide-react";
import {
  Alert as ShadAlert,
  AlertDescription,
  AlertTitle,
} from "./ui/alert"

export const Alert = ({
  title,
  content,
  variant,
}: {
  title: string;
  content: string | React.ReactNode;
  variant: "default" | "destructive" | null | undefined;
}) => {
  return (
    <ShadAlert variant={variant} className="animate-bounce-fade-in">
      <Terminal />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {content}
      </AlertDescription>
    </ShadAlert>
  )
}

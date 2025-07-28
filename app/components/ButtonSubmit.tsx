import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "~/lib/utils";

interface ButtonSubmitProps {
  state: 'idle' | 'submitting' | 'loading';
  loadingText?: string;
  submitText?: string;
  className?: string;
  formId?: string;
}

export const ButtonSubmit = ({ state = 'idle', loadingText = 'Creando...', submitText = 'Crear usuario', className, formId }: ButtonSubmitProps) => {
  return (
    <Button type="submit" disabled={state === "submitting"} className={cn("w-full", className)} form={formId}>
      {state === "submitting" ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin-clockwise repeat-infinite" />
          <span >{loadingText}</span>
        </>
      ) : (
        submitText
      )}
    </Button>
  )
}

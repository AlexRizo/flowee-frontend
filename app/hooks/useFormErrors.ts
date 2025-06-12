import { useState } from "react"

export const useFormErrors = () => {
  const [ message, setMessage ] = useState<string | undefined>(undefined);
  const [ error, setError ] = useState<boolean>(false);

  const reset = () => {
    setMessage(undefined);
    setError(false);
  }

  const setErrorMessage = (error: boolean = false, message?: string) => {
    setMessage(message);
    setError(error);
  }

  return {
    message,
    error,
    reset,
    setErrorMessage,
  }
}
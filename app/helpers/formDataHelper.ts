export const getFormData = (formData: FormData, keys: string[], jsonKeys: string[] = []) => {
  const originalData = formData;
  const data: Record<string, any> = {};

  keys.forEach((key) => {
    const value = originalData.get(key);
    if (value !== undefined && value !== null) {
      if (jsonKeys.includes(key)) {
        data[key] = JSON.parse(value as string);
      } else {
        data[key] = value;
      }
    }
  });

  return data;
}

export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return formData;
}
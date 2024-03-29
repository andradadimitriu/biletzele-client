import { useState } from "react";

export function useFormFields(initialState) {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    function(event) {
      setValues({
        ...fields,
        [event.target.id]: event.target.value
      });
    }
  ];
}

export function useCheckboxFormFields(initialState) {
  const [fields, setValues] = useState(initialState);
  return [
    fields,
    function(event) {
      setValues({
        ...fields,
        [event.target.id]: !fields[event.target.id]
      });
    }
  ];
}
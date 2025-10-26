export interface CustomField {
  id: number;
  field_group_id: number;
  label: string;
  name: string;
  key: string;
  type: FieldType;
  instructions?: string;
  required: boolean;
  default_value?: any;
  placeholder?: string;
  choices?: Record<string, string>;
  multiple: boolean;
  model_type?: string | null;
  conditional_logic?: any;
  wrapper?: {
    width?: string;
    class?: string;
    id?: string;
  };
  order: number;
}

export interface FieldGroup {
  id: number;
  title: string;
  key: string;
  description?: string;
  location?: any;
  position: number;
  active: boolean;
  fields: CustomField[];
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'url'
  | 'password'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'datetime'
  | 'time'
  | 'color'
  | 'file'
  | 'image'
  | 'wysiwyg'
  | 'true_false'
  | 'model';

export interface FieldValues {
  [key: string]: any;
}

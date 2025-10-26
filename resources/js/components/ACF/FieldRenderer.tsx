import { CustomField, FieldValues } from '@/types/acf';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FieldRendererProps {
  field: CustomField;
  value: any;
  onChange: (key: string, value: any) => void;
  error?: string;
  modelOptions?: any[];
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  modelOptions,
}) => {
  const handleChange = (newValue: any) => {
    onChange(field.key, newValue);
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'password':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={value?.[0] || ''}
            onChange={(e) => handleChange([e.target.value])}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value?.[0] || ''}
            onChange={(e) => handleChange([e.target.value])}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value?.[0] || ''}
            onChange={(e) => handleChange([e.target.value])}
            className={error ? 'border-red-500' : ''}
            rows={5}
          />
        );

      case 'select':
        if (field.multiple) {
          return (
            <div className="space-y-2">
              {field.choices &&
                Object.entries(field.choices).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${field.key}-${key}`}
                      checked={value?.includes(key) || false}
                      onCheckedChange={(checked) => {
                        const currentValues = value || [];
                        if (checked) {
                          handleChange([...currentValues, key]);
                        } else {
                          handleChange(
                            currentValues.filter((v: string) => v !== key),
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={`${field.key}-${key}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {label}
                    </label>
                  </div>
                ))}
            </div>
          );
        } else {
          return (
            <Select
              value={value?.[0] || ''}
              onValueChange={(val) => handleChange([val])}
            >
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder || 'Select...'} />
              </SelectTrigger>
              <SelectContent>
                {field.choices &&
                  Object.entries(field.choices).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          );
        }

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.choices &&
              Object.entries(field.choices).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.key}-${key}`}
                    checked={value?.includes(key) || false}
                    onCheckedChange={(checked) => {
                      const currentValues = value || [];
                      if (checked) {
                        handleChange([...currentValues, key]);
                      } else {
                        handleChange(
                          currentValues.filter((v: string) => v !== key),
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={`${field.key}-${key}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {label}
                  </label>
                </div>
              ))}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.choices &&
              Object.entries(field.choices).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${field.key}-${key}`}
                    name={field.key}
                    value={key}
                    checked={value?.[0] === key}
                    onChange={() => handleChange([key])}
                    className="h-4 w-4 text-primary"
                  />
                  <label
                    htmlFor={`${field.key}-${key}`}
                    className="text-sm font-medium leading-none"
                  >
                    {label}
                  </label>
                </div>
              ))}
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value?.[0] || ''}
            onChange={(e) => handleChange([e.target.value])}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'datetime':
        return (
          <Input
            type="datetime-local"
            value={value?.[0] || ''}
            onChange={(e) => handleChange([e.target.value])}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'time':
        return (
          <Input
            type="time"
            value={value?.[0] || ''}
            onChange={(e) => handleChange([e.target.value])}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'color':
        return (
          <Input
            type="color"
            value={value?.[0] || '#000000'}
            onChange={(e) => handleChange([e.target.value])}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'true_false':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.key}
              checked={value?.[0] === true || value?.[0] === 'true'}
              onCheckedChange={(checked) => handleChange([checked])}
            />
            <label
              htmlFor={field.key}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </label>
          </div>
        );

      case 'model':
        return (
          <Select
            value={value?.[0] || ''}
            onValueChange={(val) => handleChange([val])}
          >
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={field.placeholder || 'Select...'} />
            </SelectTrigger>
            <SelectContent>
              {modelOptions && modelOptions.map((option: any) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.name}
                  {option.description && ` - ${option.description}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            type="text"
            placeholder={field.placeholder}
            value={value?.[0] || ''}
            onChange={(e) => handleChange([e.target.value])}
            className={error ? 'border-red-500' : ''}
          />
        );
    }
  };

  if (field.type === 'true_false') {
    return (
      <div className="space-y-2">
        {renderField()}
        {field.instructions && (
          <p className="text-sm text-muted-foreground">{field.instructions}</p>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {field.instructions && (
        <p className="text-sm text-muted-foreground">{field.instructions}</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

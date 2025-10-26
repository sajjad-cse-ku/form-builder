import { FieldGroup, CustomField, FieldType } from '@/types/acf';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler, useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit as EditIcon, Trash2, GripVertical, ExternalLink, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
  fieldGroup: FieldGroup;
}

const breadcrumbs = (fieldGroup: FieldGroup): BreadcrumbItem[] => [
  { title: 'Field Groups', href: '/field-groups' },
  { title: fieldGroup.title, href: `/field-groups/${fieldGroup.id}/edit` },
];

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'url', label: 'URL' },
  { value: 'password', label: 'Password' },
  { value: 'select', label: 'Select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' },
  { value: 'date', label: 'Date' },
  { value: 'datetime', label: 'Date Time' },
  { value: 'time', label: 'Time' },
  { value: 'color', label: 'Color' },
  { value: 'true_false', label: 'True/False' },
  { value: 'model', label: 'Model Selection' },
];

interface DraggableFieldTypeProps {
  fieldType: { value: FieldType; label: string };
}

function DraggableFieldType({ fieldType }: DraggableFieldTypeProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `field-type-${fieldType.value}`,
    data: { type: 'field-type', fieldType: fieldType.value },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-2 p-3 border-2 rounded-lg transition-all touch-none select-none ${
        isDragging 
          ? 'border-primary bg-primary/10 shadow-lg' 
          : 'border-dashed hover:bg-primary/5 hover:border-primary'
      }`}
    >
      <Plus className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">{fieldType.label}</span>
    </div>
  );
}

interface DroppableFieldZoneProps {
  children: React.ReactNode;
  isEmpty: boolean;
}

function DroppableFieldZone({ children, isEmpty }: DroppableFieldZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'drop-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[350px] transition-all duration-200 p-6 rounded-lg ${
        isOver 
          ? 'bg-primary/20 border-2 border-primary ring-4 ring-primary/20 shadow-lg' 
          : isEmpty 
            ? 'border-2 border-dashed border-muted-foreground/30 bg-muted/5' 
            : 'border-2 border-transparent'
      }`}
    >
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center text-muted-foreground py-16">
          <div className="text-6xl mb-4">📋</div>
          <p className="mb-2 font-medium text-base">No fields yet</p>
          <p className="text-sm">Drag field types from the left to add them here</p>
          {isOver && (
            <p className="text-sm text-primary font-medium mt-4 animate-pulse">
              Drop here to add field
            </p>
          )}
        </div>
      ) : (
        <>
          {isOver && (
            <div className="mb-4 p-3 bg-primary/10 border-2 border-primary rounded-lg text-center">
              <p className="text-sm font-medium text-primary">Drop here to add new field</p>
            </div>
          )}
          {children}
        </>
      )}
    </div>
  );
}

interface SortableFieldItemProps {
  field: CustomField;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableFieldItem({ field, onEdit, onDelete }: SortableFieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex items-center gap-3 p-4 border rounded-lg transition-all bg-background ${
        isOver 
          ? 'border-primary bg-primary/10 shadow-md scale-[1.02]' 
          : 'hover:bg-muted/50'
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{field.label}</span>
          {field.required && (
            <Badge variant="destructive" className="text-xs">
              Required
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            {field.type}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Key: <code>{field.key}</code>
          {field.instructions && ` • ${field.instructions}`}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <EditIcon className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {isOver && (
        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full animate-pulse" />
      )}
    </div>
  );
}

export default function Edit({ fieldGroup }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    title: fieldGroup.title,
    key: fieldGroup.key,
    description: fieldGroup.description || '',
    position: fieldGroup.position,
    active: fieldGroup.active,
  });

  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [copied, setCopied] = useState(false);
  const [fields, setFields] = useState<CustomField[]>(fieldGroup.fields);
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [newFieldType, setNewFieldType] = useState<FieldType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Just use rectIntersection for all drag operations - it's most reliable
  const collisionDetectionStrategy = rectIntersection;

  useEffect(() => {
    setFields(fieldGroup.fields);
  }, [fieldGroup.fields]);

  const publicFormUrl = `${window.location.origin}/form/${fieldGroup.key}`;

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    put(`/field-groups/${fieldGroup.id}`);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicFormUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteField = (fieldId: number) => {
    if (confirm('Are you sure you want to delete this field?')) {
      router.delete(`/custom-fields/${fieldId}`, {
        preserveState: true,
      });
    }
  };

  const openFieldModal = (field?: CustomField) => {
    setEditingField(field || null);
    setIsFieldModalOpen(true);
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    console.log('🎯 Drag ended:', { 
      activeId: active.id, 
      overId: over?.id,
      activeType: typeof active.id,
      overType: typeof over?.id 
    });

    // Check if dropping a new field type
    if (typeof active.id === 'string' && active.id.startsWith('field-type-')) {
      console.log('✅ Detected field type drag');
      
      // Accept drop on drop-zone OR over any existing field
      if (over && (over.id === 'drop-zone' || typeof over.id === 'number')) {
        const fieldType = active.id.replace('field-type-', '') as FieldType;
        console.log('🚀 Opening modal for field type:', fieldType);
        
        // If dropped over a field, we'll insert it at that position
        // Store the target field ID for later use
        if (typeof over.id === 'number') {
          console.log('📍 Will insert near field ID:', over.id);
          // You can store this to use when creating the field
          // For now, just open the modal
        }
        
        setNewFieldType(fieldType);
        openFieldModal();
      } else {
        console.log('❌ No valid drop target. Over ID was:', over?.id);
      }
      return;
    }

    // Handle reordering existing fields
    if (over && active.id !== over.id && typeof active.id === 'number') {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        if (oldIndex === -1 || newIndex === -1) return items;
        
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update order on backend
        const fieldIds = newItems.map((item) => item.id);
        router.post(
          `/field-groups/${fieldGroup.id}/reorder-fields`,
          { field_ids: fieldIds },
          { preserveState: true }
        );

        return newItems;
      });
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs(fieldGroup)}>
      <Head title={`Edit ${fieldGroup.title}`} />
      <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Field Group</h1>
        <p className="text-muted-foreground">
          Update field group settings and manage fields
        </p>
      </div>

      <div className="grid gap-6">
        {/* Field Group Settings */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Field Group Settings</CardTitle>
              <CardDescription>
                Configure the basic settings for your field group
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="key">Key *</Label>
                  <Input
                    id="key"
                    value={data.key}
                    onChange={(e) => setData('key', e.target.value)}
                  />
                  {errors.key && (
                    <p className="text-sm text-red-500">{errors.key}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    type="number"
                    value={data.position}
                    onChange={(e) =>
                      setData('position', parseInt(e.target.value))
                    }
                  />
                </div>

                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="active"
                    checked={data.active}
                    onCheckedChange={(checked) =>
                      setData('active', checked as boolean)
                    }
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Public Form URL */}
        <Card>
          <CardHeader>
            <CardTitle>Public Form</CardTitle>
            <CardDescription>
              Share this URL to allow others to submit this form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  value={publicFormUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyUrl}
                  title="Copy URL"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <a
                  href={publicFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    type="button"
                    variant="default"
                    title="Open Public Form"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Form
                  </Button>
                </a>
              </div>
              {copied && (
                <p className="text-sm text-green-600">
                  ✓ URL copied to clipboard!
                </p>
              )}
              {!fieldGroup.active && (
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
                  ⚠️ This form is currently inactive. Activate it to accept submissions.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fields with Drag & Drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="grid lg:grid-cols-[300px_1fr] gap-6">
            {/* Field Types Palette */}
            <Card className="h-fit sticky top-4">
              <CardHeader>
                <CardTitle className="text-base">Field Types</CardTitle>
                <CardDescription className="text-sm">
                  Drag field types to the form builder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {FIELD_TYPES.map((fieldType) => (
                    <DraggableFieldType key={fieldType.value} fieldType={fieldType} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fields List */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Form Builder</CardTitle>
                    <CardDescription>
                      Drag to reorder or drag field types from the left
                    </CardDescription>
                  </div>
                  <Button onClick={() => openFieldModal()} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <DroppableFieldZone isEmpty={fields.length === 0}>
                  <SortableContext
                    items={fields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {fields.map((field) => (
                        <SortableFieldItem
                          key={field.id}
                          field={field}
                          onEdit={() => openFieldModal(field)}
                          onDelete={() => handleDeleteField(field.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DroppableFieldZone>
              </CardContent>
            </Card>
          </div>

          <DragOverlay dropAnimation={null}>
            {activeId && typeof activeId === 'string' && activeId.startsWith('field-type-') ? (
              <div className="flex items-center gap-2 p-4 border-2 border-primary rounded-lg bg-background shadow-2xl scale-105 rotate-2">
                <Plus className="h-5 w-5 text-primary" />
                <span className="text-base font-semibold text-primary">
                  {FIELD_TYPES.find((ft) => `field-type-${ft.value}` === activeId)?.label}
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Field Modal */}
      <FieldModal
        isOpen={isFieldModalOpen}
        onClose={() => {
          setIsFieldModalOpen(false);
          setNewFieldType(null);
        }}
        fieldGroup={fieldGroup}
        field={editingField}
        preselectedType={newFieldType}
      />
    </div>
    </AppLayout>
  );
}

interface FieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldGroup: FieldGroup;
  field?: CustomField | null;
  preselectedType?: FieldType | null;
}

function FieldModal({
  isOpen,
  onClose,
  fieldGroup,
  field,
  preselectedType,
}: FieldModalProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    label: field?.label || '',
    name: field?.name || '',
    key: field?.key || '',
    type: preselectedType || field?.type || ('text' as FieldType),
    instructions: field?.instructions || '',
    required: field?.required || false,
    default_value: field?.default_value || null,
    placeholder: field?.placeholder || '',
    choices: field?.choices || {},
    multiple: field?.multiple || false,
    model_type: field?.model_type || null,
    conditional_logic: field?.conditional_logic || null,
    wrapper: field?.wrapper || null,
    order: field?.order || 0,
  });

  //Available models for field linking
  const availableFieldModels = [
    { value: 'Category', label: 'Category' },
    { value: 'Brand', label: 'Brand' },
    { value: 'School', label: 'School' },
    { value: 'SchoolClass', label: 'School Class' },
  ];

  const [choiceKey, setChoiceKey] = useState('');
  const [choiceValue, setChoiceValue] = useState('');

  // Update form data when field changes or modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset choice inputs
      setChoiceKey('');
      setChoiceValue('');
      
      if (field) {
        // Editing existing field - load its data
        // Ensure choices is always an object, even if it's null or an array
        const fieldChoices = field.choices && typeof field.choices === 'object' && !Array.isArray(field.choices)
          ? field.choices 
          : {};
          
        setData({
          label: field.label,
          name: field.name,
          key: field.key,
          type: field.type,
          instructions: field.instructions || '',
          required: field.required,
          default_value: field.default_value || null,
          placeholder: field.placeholder || '',
          choices: fieldChoices,
          multiple: field.multiple,
          model_type: field.model_type || null,
          conditional_logic: field.conditional_logic || null,
          wrapper: field.wrapper || null,
          order: field.order,
        });
      } else {
        // Creating new field - reset to defaults with preselected type
        reset();
        if (preselectedType) {
          setData('type', preselectedType);
        }
      }
    }
  }, [field, isOpen, preselectedType]);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    
    console.log('📝 Submitting field data:', data);
    
    if (field) {
      put(`/custom-fields/${field.id}`, {
        onSuccess: () => {
          console.log('✅ Field updated successfully');
          onClose();
          reset();
        },
        onError: (errors) => {
          console.error('❌ Field update failed:', errors);
        },
      });
    } else {
      post(`/field-groups/${fieldGroup.id}/fields`, {
        onSuccess: () => {
          console.log('✅ Field created successfully');
          onClose();
          reset();
        },
        onError: (errors) => {
          console.error('❌ Field creation failed:', errors);
        },
      });
    }
  };

  const generateKey = (label: string) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  };

  const addChoice = () => {
    const trimmedKey = choiceKey.trim();
    const trimmedValue = choiceValue.trim();
    
    if (!trimmedKey || !trimmedValue) {
      alert('Please enter both key and label');
      return;
    }
    
    // Ensure choices is an object
    const currentChoices = data.choices && typeof data.choices === 'object' && !Array.isArray(data.choices)
      ? data.choices
      : {};
    
    // Check if key already exists
    if (currentChoices[trimmedKey]) {
      if (!confirm(`Key "${trimmedKey}" already exists. Replace it?`)) {
        return;
      }
    }
      
    setData('choices', {
      ...currentChoices,
      [trimmedKey]: trimmedValue,
    });
    
    setChoiceKey('');
    setChoiceValue('');
  };

  const handleChoiceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addChoice();
    }
  };

  const removeChoice = (key: string) => {
    const currentChoices = data.choices && typeof data.choices === 'object' && !Array.isArray(data.choices)
      ? data.choices
      : {};
    const newChoices = { ...currentChoices };
    delete newChoices[key];
    setData('choices', newChoices);
  };

  const needsChoices = ['select', 'checkbox', 'radio'].includes(data.type);
  const needsModel = data.type === 'model';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {field ? 'Edit Field' : 'Add New Field'}
          </DialogTitle>
          <DialogDescription>
            Configure the field settings and options
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                value={data.label}
                onChange={(e) => {
                  setData('label', e.target.value);
                  if (!field) {
                    const key = generateKey(e.target.value);
                    setData('name', key);
                    setData('key', `field_${key}`);
                  }
                }}
              />
              {errors.label && (
                <p className="text-sm text-red-500">{errors.label}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Field Type *</Label>
              <Select
                value={data.type}
                onValueChange={(value) => setData('type', value as FieldType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="key">Key *</Label>
              <Input
                id="key"
                value={data.key}
                onChange={(e) => setData('key', e.target.value)}
              />
              {errors.key && (
                <p className="text-sm text-red-500">{errors.key}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={data.instructions}
              onChange={(e) => setData('instructions', e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={data.placeholder}
              onChange={(e) => setData('placeholder', e.target.value)}
            />
          </div>

          {needsChoices && (
            <div className="space-y-2">
              <Label>Choices (Key-Value Pairs) *</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Add options for this field. The key is stored in the database, the label is shown to users.
              </p>
              <div className="space-y-2">
                {/* Display existing choices */}
                {data.choices && Object.keys(data.choices).length > 0 && (
                  <div className="space-y-2 mb-3 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Current Choices:</p>
                    {Object.entries(data.choices).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 bg-background p-2 rounded">
                        <Input value={key} disabled className="flex-1 font-mono text-sm" />
                        <span className="text-muted-foreground">→</span>
                        <Input value={value} disabled className="flex-1" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeChoice(key)}
                          title="Remove this choice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add new choice */}
                <div className="border-2 border-dashed rounded-lg p-3 bg-blue-50/50">
                  <p className="text-xs font-medium mb-2">Add New Choice:</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Key (e.g., red, small, option1)"
                        value={choiceKey}
                        onChange={(e) => setChoiceKey(e.target.value)}
                        onKeyDown={handleChoiceKeyDown}
                        className="mb-1"
                      />
                      <p className="text-xs text-muted-foreground">Database value</p>
                    </div>
                    <span className="text-lg text-muted-foreground self-start mt-1">→</span>
                    <div className="flex-1">
                      <Input
                        placeholder="Label (e.g., Red, Small, Option 1)"
                        value={choiceValue}
                        onChange={(e) => setChoiceValue(e.target.value)}
                        onKeyDown={handleChoiceKeyDown}
                        className="mb-1"
                      />
                      <p className="text-xs text-muted-foreground">Display text</p>
                    </div>
                    <Button 
                      type="button" 
                      onClick={addChoice} 
                      size="default"
                      disabled={!choiceKey.trim() || !choiceValue.trim()}
                      className="self-start"
                      title={!choiceKey.trim() || !choiceValue.trim() ? 'Fill both fields to add' : 'Add choice (or press Enter)'}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Tip: Fill both fields and click "Add" or press Enter
                  </p>
                </div>
                
                {needsChoices && (!data.choices || Object.keys(data.choices).length === 0) && (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
                    ⚠️ Add at least one choice option for this field to work properly
                  </p>
                )}
              </div>
            </div>
          )}

          {needsModel && (
            <div className="space-y-2">
              <Label htmlFor="model_type">Select Model *</Label>
              <Select
                value={data.model_type || ''}
                onValueChange={(value) => setData('model_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose which model to select from" />
                </SelectTrigger>
                <SelectContent>
                  {availableFieldModels.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Users will be able to select from {data.model_type || 'the chosen model'} records
              </p>
              {needsModel && !data.model_type && (
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
                  ⚠️ Please select a model for this field to work properly
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={data.required}
                onCheckedChange={(checked) =>
                  setData('required', checked as boolean)
                }
              />
              <Label htmlFor="required">Required</Label>
            </div>

            {data.type === 'select' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="multiple"
                  checked={data.multiple}
                  onCheckedChange={(checked) =>
                    setData('multiple', checked as boolean)
                  }
                />
                <Label htmlFor="multiple">Multiple Selection</Label>
              </div>
            )}
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</p>
              <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                {Object.entries(errors).map(([key, value]) => (
                  <li key={key}>{key}: {value}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Saving...' : field ? 'Update Field' : 'Add Field'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

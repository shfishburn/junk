import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: "text" | "email" | "tel";
  placeholder?: string;
  required?: boolean;
  error?: string;
  maxLength?: number;
  className?: string;
}

interface TextareaFieldProps extends Omit<FormFieldProps, "type"> {
  rows?: number;
}

export function FormField({
  id,
  name,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  error,
  maxLength,
  className,
}: FormFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={id}>
        {label}
        {required && " *"}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className={cn("mt-1", error && "border-destructive")}
      />
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}

export function TextareaField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  maxLength,
  rows = 3,
  className,
}: TextareaFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={id}>
        {label}
        {required && " *"}
      </Label>
      <Textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        rows={rows}
        className={cn("mt-1", error && "border-destructive")}
      />
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}

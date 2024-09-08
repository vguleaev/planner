// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FormFieldError({ field }: { field: any }) {
  return (
    <div className="w-full text-sm text-right text-destructive mt-[-12px]">
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <span>{field.state.meta.errors.join(', ')}</span>
      ) : null}
    </div>
  );
}

import "./FormError.scss";

interface FormErrorProps {
  message: string | null;
}

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return <p className="form-error">{message}</p>;
}

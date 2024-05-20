interface ServicesListProps {
  serviceSearchkey: string;
}

export default function ServicesList({ serviceSearchkey }: ServicesListProps) {
  return <p>ServicesList {serviceSearchkey}</p>;
}

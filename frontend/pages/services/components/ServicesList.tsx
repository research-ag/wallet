import useServices from "../hooks/useServices";

interface ServicesListProps {
  serviceSearchkey: string;
  assetFilter: string[];
}

export default function ServicesList({ serviceSearchkey }: ServicesListProps) {
  console.log("ServicesList");
  const { services } = useServices({});

  return (
    <div>
      {services.map((service, index) => (
        <p key={index}>ServicesList {serviceSearchkey}</p>
      ))}
    </div>
  );
}

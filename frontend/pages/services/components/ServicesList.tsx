import useServices from "../hooks/useServices";

interface ServicesListProps {
  serviceSearchkey: string;
  assetFilter: string[];
}

export default function ServicesList({ serviceSearchkey, assetFilter }: ServicesListProps) {
  const { services } = useServices({ serviceSearchkey, assetFilter });

  return (
    <div>
      {services.map((service, index) => (
        <p key={index}>ServicesList {serviceSearchkey}</p>
      ))}
    </div>
  );
}

import { BusArrivalsList } from '../components/BusArrivalsList';
import { MapView } from '../components/MapView';

interface HomeProps {
  onSelectBus: (busId: string) => void;
}

export function Home({ onSelectBus }: HomeProps) {
  return (
    <>
      <div className="mobile-map">
        <MapView />
      </div>
      <BusArrivalsList onSelectBus={onSelectBus} />
    </>
  );
}

import React from 'react';
import { useSelector } from 'react-redux';
import RegionDetailsModal from '../ui/RegionDetailsModal';
import './RegionsPanel.css';

const RegionsPanel = () => {
    const regions = useSelector(state => state.world.regions);
    const [selectedRegion, setSelectedRegion] = React.useState(null);

    const handleRegionClick = (region) => {
        setSelectedRegion(region);
    };

    const closeModal = () => {
        setSelectedRegion(null);
    };

    return (
        <div className="regions-panel">
            <h2>Regions</h2>
            <ul>
                {regions.map(region => (
                    <li key={region.id} onClick={() => handleRegionClick(region)}>
                        {region.name}
                    </li>
                ))}
            </ul>
            {selectedRegion && (
                <RegionDetailsModal 
                    region={selectedRegion} 
                    onClose={closeModal} 
                />
            )}
        </div>
    );
};

export default RegionsPanel;
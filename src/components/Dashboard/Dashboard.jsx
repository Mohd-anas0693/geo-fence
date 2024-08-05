import { useState } from "react";

import DefaultMapView from "../DefaultMapView";
import  Geofence from "../Geofence";
import Sidebar from "../Sidebar";
import {
  DashboardContainer,
  MapSection,
  SidebarSection,
} from "./Dashboard.styled";
// import { AutoComplete } from "../AutoComplete";
export const Dashboard = () => {
  const [mapView, setMapView] = useState("defaultMap");
  const handleMapViewChnage = (value) => setMapView(value);

  const renderMap = (feature) => {
    switch (feature) {
      case "defaultMap":
        return <DefaultMapView />;
      case "geoFence":
        return <Geofence />;
      // case "AutoCompleteT":
      //   return <AutoCompleteT/>
      default:
        return null;
    }
  };

  return (
    <DashboardContainer>
      <SidebarSection>
        <Sidebar mapView={mapView} handleMapViewChnage={handleMapViewChnage} />
      </SidebarSection>
      <MapSection>{renderMap(mapView)}</MapSection>
    </DashboardContainer>
  );
};

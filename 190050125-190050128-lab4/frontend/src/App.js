import CssBaseline from "@mui/material/CssBaseline";
// @mui material components
import { ThemeProvider } from "@mui/material/styles";
// Material Kit 2 React themes
import theme from "assets/theme";
import Matches from "components/Matches";
import MatchInfo from "components/MatchInfo";
import PlayerInfo from "components/PlayerInfo";
import PointsTable from "components/PointsTable";
import VenueInfo from "components/VenueInfo";
import Venues from "components/Venues";
import VenueAdd from "components/Venues/new_venue";
import Presentation from "layouts/pages/presentation";
import { useEffect } from "react";
// react-router components
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

export default function App() {
  const { pathname } = useLocation();

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/match/:id" element={<MatchInfo />} />
        <Route path="/matches*" element={<Matches />} />
        <Route path="/players/:id" element={<PlayerInfo />} />
        <Route path="/pointstable/:year" element={<PointsTable />} />
        <Route path="/venue/:id" element={<VenueInfo />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/venues/add" element={<VenueAdd />} />
        <Route path="/presentation" element={<Presentation />} />
        <Route path="*" element={<Navigate to="/presentation" />} />
      </Routes>
    </ThemeProvider>
  );
}
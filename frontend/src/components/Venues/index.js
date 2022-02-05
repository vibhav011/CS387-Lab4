import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CustomTable2 from "components/CustomTable2";
// Material Kit 2 React components
import MKBox from "components/MKBox";
import BaseLayout from "layouts/sections/components/BaseLayout";
import { useEffect, useState } from "react";


const headers = [
  'Venue Details'
]

function formatter(venue) {
  return [
  <>
    <a href={"/venue/" + venue.venue_id} style={{ color: "#3d82cc", fontWeight: "bold" }}>
      {venue.venue_name}
    </a>
    <p style={{ color: "#6e6867", fontSize: "15px" }}>[{venue.city_name}, {venue.country_name}]</p>
  </>
  ];
}

function Venues(props) {
  const [rows, setRows] = useState([["Loading..."]]);

  useEffect(() => {
    fetch(`http://localhost:8081/venues/`)
      .then(res => res.json().then(data => ({ status: res.status, body: data })))
      .then(data => {
        let body = data.body;

        if (data.status === 200) {
          console.log(body.data);
          setRows(body.data.map(venue => formatter(venue)));
        }
        else {
          console.log("Error in Venues fetch");
          console.log(body.error);
          setRows([["Some error occured. Check logs.", ""]]);
        }
      })
  }, []);

  return (
    <BaseLayout title="Venues"
      breadcrumb={[
        { label: "Home", route: "/" },
        { label: "Venues" },
      ]}>
      <MKBox component="section" py={{ xs: 3, md: 3 }}>
        <Container>
          <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={12} lg={9}>
              <CustomTable2 rows={rows} header={headers} />
            </Grid>
          </Grid>
        </Container>
      </MKBox>
    </BaseLayout>
  );
}

export default Venues;
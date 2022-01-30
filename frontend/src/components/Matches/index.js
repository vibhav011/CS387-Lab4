import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useSearchParams } from 'react-router-dom'

// Table
import CustomTable from "components/CustomTable";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import BaseLayout from "layouts/sections/components/BaseLayout";
import { useEffect, useRef, useState } from "react";

const headers = [
  'Season Year',
  'Match Details',
]

function formatter(match) {
  return [match.season_year,
  <>
    <a href={"/match/" + match.match_id} style={{ color: "#3d82cc", fontWeight: "bold" }}>
      {match.team1_name} vs {match.team2_name}
    </a>
    <p style={{ color: "#6e6867", fontSize: "15px" }}>[{match.venue_name}, {match.city_name}]</p>
    <p style={{ color: "#cf3453" }}>{match.winner} won by {match.win_margin} {match.win_type}</p>
  </>
  ];
}

function Matches(props) {
  const [skipHook, setSkip] = useState(-1);
  const [limitHook, setLimit] = useState(-1);
  const [rows, setRows] = useState([["Loading...", ""]]);
  const [searchParams, setSearchParams] = useSearchParams();
  const skip = searchParams.get("skip") || 0;
  const limit = searchParams.get("limit") || 10;

  if (skipHook !== skip || limitHook !== limit) {
    fetch(`http://localhost:8081/matches?skip=${skip}&limit=${limit}`)
      .then(res => res.json().then(data => ({ status: res.status, body: data })))
      .then(data => {
        setSkip(skip);
        setLimit(limit);
        let body = data.body;

        if (data.status === 200) {
          console.log(body.data);
          setRows(body.data.map(match => formatter(match)));
        }
        else {
          console.log("Error in Matches fetch");
          console.log(body.error);
          setRows([["Some error occured. Check logs.", ""]]);
        }
      })
  }

  return (
    <BaseLayout title="Matches"
      breadcrumb={[
        { label: "Home", route: "/" },
        { label: "Matches" },
      ]}>
      <MKBox component="section" py={{ xs: 3, md: 3 }}>
        <Container>
          <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={12} lg={9}>
              <CustomTable rows={rows} header={headers} skip={skip} limit={limit} pagination={true} />
            </Grid>
          </Grid>
        </Container>
      </MKBox>
    </BaseLayout>
  );
}

export default Matches;
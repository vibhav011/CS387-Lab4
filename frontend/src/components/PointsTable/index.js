import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useParams } from 'react-router-dom'

// Table
import CustomTable2 from "components/CustomTable2";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import BaseLayout from "layouts/sections/components/BaseLayout";
import React, { useEffect } from "react";

import Card from '@mui/material/Card';
import { CardContent } from "@mui/material";

import TextField from '@mui/material/TextField';

const header = [
    'Team Name', 'Mat', 'Won', 'Lost', 'Tied', 'NR', 'Points'
]
const json_keys = [
    "team_name", "mat", "won", "lost", "tied", "nr", "pts"
]

function formatter(data) {
    return data.map((d) => {
        return json_keys.map((k, i) => {
            if (k == "nr") {
                let u = parseFloat(d[k]) > 0
                return <text style = {{color: u?"green":"red"}}>{u ? '+' + d[k] : d[k]}</text>;
            }
            if (k == "team_name") return <b>{d[k]}</b>
            return d[k];
        })
    });
}

function PointsTable(props) {
    const { year } = useParams();
    const [rows, setRows] = React.useState([[]]);

    useEffect(() => {
        fetchData(year);
    }, []);

    const fetchData = (year) => {
        setRows([["Loading...", "", "", "", "", "", ""]]);
        fetch(`http://localhost:8081/pointstable/${year}`)
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(data => {
                let body = data.body;

                if (data.status === 200) {
                    // console.log(body);
                    setRows(formatter(body.data));
                }
                else if (data.status === 404) {
                    setRows([["No data found for this year.", "", "", "", "", "", ""]]);
                }
                else {
                    console.log("Error in scorecard fetch");
                    setRows([[`Error ${data.status}: ${body.error}`, "", "", "", "", "", ""]]);
                }
            });
    }

    const handleKeyUp = (event) => {
        if (event.key === 'Enter') {
            let y = parseInt(event.target.value);
            if (!y) return
            window.history.pushState(null, null, `/pointstable/${y}`);
            fetchData(y);
        }
    }

    return (
        <BaseLayout title="Points Table"
            breadcrumb={[
                { label: "Home", route: "/" },
                { label: "Points Table" },
            ]}>
            <MKBox component="section" py={{ xs: 3, md: 3 }}>
                <Container>
                    <Grid container alignItems="center" justifyContent="center">
                        <Card sx={{ borderRadius: '10px', width: "85%" }}>

                            <CardContent>
                            <TextField id="outlined-basic"
                                       label="Year"
                                       variant="outlined"
                                       defaultValue={year}
                                       margin="normal"
                                       inputProps={{ maxLength: 4,onKeyUp: handleKeyUp }}
                            />
                                <CustomTable2 header={header} rows={rows}/>

                            </CardContent>
                        </Card>
                    </Grid>
                </Container>
            </MKBox>
        </BaseLayout>
    );
}

export default PointsTable;
import { Alert, CardContent, CardHeader, Snackbar } from "@mui/material";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
// Material Kit 2 React components
import MKBox from "components/MKBox";
import BaseLayout from "layouts/sections/components/BaseLayout";
import PropTypes from 'prop-types';
import React from "react";
import { useParams } from 'react-router-dom';
import ScorecardElement from "./scorecard";
import ScoreComparisonElement from "./scoreComparison";
import Summary from "./summary";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

class MatchInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            teams: "Team1 vs Team2",
            year: "Year",
            b2data: {},
            b3data: {},
            b4data: {},
            b4pie: {},
            open: false,
            msg: "Error"
        };
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ open: false });
    };

    componentDidMount() {
        const { id } = this.props.params;
        // setTimeout(() => {
        //     this.fetchData(id);
        // }, 1000);
        this.fetchData(id);
    }

    fetchData(id) {
        fetch(`http://localhost:8081/matches/scorecard/${id}`)
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(data => {
                let body = data.body;

                if (data.status === 200) {
                    let info = body.match_info.info[0];
                    this.setState({
                        b2data: body,
                        teams: info.team1_name + " vs " + info.team2_name,
                        year: info.year_of_playing
                    });
                }
                else {
                    this.setState({ open: true, msg: `Error ${data.status}: ${body.error}` });
                    console.log("Error in scorecard fetch");
                    console.log(body.error);
                }
            });

        fetch(`http://localhost:8081/matches/score_comparison/${id}`)
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(data => {
                let body = data.body;

                if (data.status === 200) {
                    this.setState({ b3data: body });
                }
                else {
                    console.log("Error in score_comparison fetch");
                    console.log(body.error);
                }
            });

        fetch(`http://localhost:8081/matches/match_summary/${id}`)
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(data => {
                let body = data.body;

                if (data.status === 200) {
                    this.setState({ b4data: body });
                }
                else {
                    console.log("Error in match_summary fetch");
                    console.log(body.error);
                }
            });

        fetch(`http://localhost:8081/matches/pie_chart/${id}`)
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(data => {
                let body = data.body;

                if (data.status === 200) {
                    this.setState({ b4pie: body });
                }
                else {
                    console.log("Error in match_summary fetch");
                    console.log(body.error);
                }
            });
    }
    handleChange = (event, newValue) => {
        // setValue(newValue);
        this.setState({ value: newValue });
    };

    render() {
        return (
            <BaseLayout title="Match Info"
                breadcrumb={[
                    { label: "Home", route: "/" },
                    { label: "Match Info" },
                ]}>
                <MKBox component="section" py={{ xs: 3, md: 3 }}>
                    <Container>
                        <Grid container alignItems="center" justifyContent="center">
                            <Snackbar open={this.state.open} onClose={this.handleClose}>
                                <Alert onClose={this.handleClose} severity="error" sx={{ width: '100%' }}>
                                    {this.state.msg}
                                </Alert>
                            </Snackbar>
                            <Card sx={{ borderRadius: '10px', width: "85%" }}>
                                <CardHeader disableTypography={true}
                                    title={<Typography variant="h3">{this.state.teams}</Typography>}
                                    subheader={<Typography sx={{ color: "#52575e" }} variant="h4">{this.state.year}</Typography>} />

                                <CardContent>

                                    <Tabs value={this.state.value} onChange={this.handleChange} aria-label="basic tabs example">
                                        <Tab label="Scorecard" {...a11yProps(0)} />
                                        <Tab label="Score Comparison" {...a11yProps(1)} />
                                        <Tab label="Summary" {...a11yProps(2)} />
                                    </Tabs>

                                    <TabPanel value={this.state.value} index={0}>
                                        <ScorecardElement data={this.state.b2data} />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={1}>
                                        <ScoreComparisonElement data={this.state.b3data} />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={2}>
                                        <Summary data={this.state.b4data} pie={this.state.b4pie} />
                                    </TabPanel>

                                </CardContent>
                            </Card>
                        </Grid>
                    </Container>
                </MKBox>
            </BaseLayout>
        );
    }
}

const NewMatchInfo = (props) => (<MatchInfo params={useParams()} />)
export default NewMatchInfo;
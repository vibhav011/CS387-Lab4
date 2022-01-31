import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useSearchParams, useParams } from 'react-router-dom'

// Table
import CustomTable from "components/CustomTable";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import BaseLayout from "layouts/sections/components/BaseLayout";
import React from "react";

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ScorecardElement from "./scorecard";
import ScoreComparisonElement from "./scoreComparison";
import Card from '@mui/material/Card';
import Summary from "./summary";
import { CardContent, CardHeader } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    console.log("tabpanel props", props);
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
            b4pie: {}
        };
    }

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
                    console.log(body);
                    let info = body.match_info.info[0];
                    this.setState({ b2data: body,
                                    teams: info.team1_name + " vs " + info.team2_name,
                                    year: info.year_of_playing });
                }
                else {
                    console.log("Error in scorecard fetch");
                    console.log(body.error);
                }
            });

        fetch(`http://localhost:8081/matches/score_comparison/${id}`)
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(data => {
                let body = data.body;

                if (data.status === 200) {
                    console.log(body);
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
                    console.log(body);
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
                    console.log(body);
                    this.setState({ b4pie: body });
                }
                else {
                    console.log("Error in match_summary fetch");
                    console.log(body.error);
                }
            });
    }

    // handleChange = (panel) => (event, isExpanded) => {
    //     this.setState({ expanded: isExpanded ? panel : false });
    // };
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
                            <Card sx={{ borderRadius: '10px', width: "85%" }}>
                                <CardHeader disableTypography={true}
                                    title={<Typography variant="h3">{this.state.teams}</Typography>}
                                    subheader={<Typography sx={{ color: "#52575e" }} variant="h4">{this.state.year}</Typography>} />

                                <CardContent>
                                    {/* <Typography variant="h6" sx={{ marginTop: "-15px", color: "#52575e" }}>Batting Hand: {this.state.basic_info.batting_hand}</Typography>
                                    <Typography gutterBottom variant="h6" sx={{ marginTop: "-5px", color: "#52575e" }}>Bowling Skill: {this.state.basic_info.bowling_skill}</Typography> */}

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
                            {/* <Accordion expanded={this.state.expanded === 'panel1'} onChange={this.handleChange('panel1')} sx={{ borderRadius: '10px', width: "85%" }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                    sx={{ backgroundColor: '#384664', borderRadius: '10px' }}
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0, color: "#fff", fontWeight: "bold" }}>
                                        Scorecard
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Card sx={{ marginLeft: 'auto', marginRight: 'auto', paddingLeft: '5px', paddingTop: '20px', width: '800px', height: '425px' }}>
                                        <ScoreComparisonElement data={this.state.b3data} />
                                    </Card>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion expanded={this.state.expanded === 'panel2'} onChange={this.handleChange('panel2')} sx={{ borderRadius: '10px', width: "85%", marginTop: '10px', marginBottom: '10px' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                                    aria-controls="panel2bh-content"
                                    id="panel2bh-header"
                                    sx={{ backgroundColor: '#384664', borderRadius: '10px' }}
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0, color: "#fff", fontWeight: "bold" }}>
                                        Score Comparison
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Card sx={{ marginLeft: 'auto', marginRight: 'auto', paddingLeft: '5px', paddingTop: '20px', width: '800px', height: '425px' }}>
                                        <ScoreComparisonElement data={this.state.b3data} />
                                    </Card>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion expanded={this.state.expanded === 'panel3'} onChange={this.handleChange('panel3')} sx={{ borderRadius: '10px', width: "85%" }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                                    aria-controls="panel3bh-content"
                                    id="panel3bh-header"
                                    sx={{ backgroundColor: '#384664', borderRadius: '10px' }}
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0, color: "#fff", fontWeight: "bold" }}>
                                        Summary
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Summary data={this.state.b4data} pie={this.state.b4pie} />
                                </AccordionDetails>
                            </Accordion> */}
                        </Grid>
                    </Container>
                </MKBox>
            </BaseLayout>
        );
    }
}

export default (props) => (<MatchInfo params={useParams()} />);
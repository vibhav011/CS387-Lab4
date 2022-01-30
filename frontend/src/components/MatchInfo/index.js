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
import { CardContent } from "@mui/material";

class MatchInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: 'panel1',
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
                    this.setState({ b2data: body });
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

    handleChange = (panel) => (event, isExpanded) => {
        this.setState({ expanded: isExpanded ? panel : false });
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
                            <Accordion expanded={this.state.expanded === 'panel1'} onChange={this.handleChange('panel1')} sx={{ borderRadius: '10px', width: "85%" }}>
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
                                    <ScorecardElement data={this.state.b2data} />
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
                            </Accordion>
                        </Grid>
                    </Container>
                </MKBox>
            </BaseLayout>
        );
    }
}

export default (props) => (<MatchInfo params={useParams()} />);
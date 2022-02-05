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
import Batting from "./batting";
import Bowling from "./bowling";

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


class PlayerInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            basic_info: {
                "player_name": "Name",
                "batting_hand": "",
                "bowling_skill": "",
                "country_name": "Country"
            },
            battingStats: {},
            battingGraph: -1,
            bowlingStats: {},
            bowlingGraph: -1,
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
        fetch(`http://localhost:8081/players/basic_info/${id}`)
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(data => {
                let body = data.body;

                if (data.status === 200) {
                    this.setState({ basic_info: body.data[0] });
                }
                else {
                    this.setState({ open: true, msg: `Error ${data.status}: ${body.error}` });
                    console.log("Error in scorecard fetch");
                    console.log(body.error);
                }
            });
        fetch(`http://localhost:8081/players/batting_stats/${id}`)
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(data => {
                let body = data.body;

                if (data.status === 200) {
                    this.setState({ battingStats: body.data[0] });
                }
                else {
                    console.log("Error in score_comparison fetch");
                    console.log(body.error);
                }
            });

        fetch(`http://localhost:8081/players/batting_graph/${id}`)
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(data => {
                let body = data.body;

                if (data.status === 200) {
                    this.setState({ battingGraph: body.data });
                }
                else {
                    console.log("Error in match_summary fetch");
                    console.log(body.error);
                }
            });

        fetch(`http://localhost:8081/players/bowling_stats/${id}`)
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(data => {
                let body = data.body;

                if (data.status === 200) {
                    this.setState({ bowlingStats: body.data[0] });
                }
                else {
                    console.log("Error in score_comparison fetch");
                    console.log(body.error);
                }
            });

        fetch(`http://localhost:8081/players/bowling_graph/${id}`)
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(data => {
                let body = data.body;

                if (data.status === 200) {
                    this.setState({ bowlingGraph: body.data });
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
            <BaseLayout title="Player Info"
                breadcrumb={[
                    { label: "Home", route: "/" },
                    { label: "Player Info" },
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
                                    title={<Typography variant="h2">{this.state.basic_info.player_name}</Typography>}
                                    subheader={<Typography sx={{ color: "#52575e" }} variant="h4">{this.state.basic_info.country_name}</Typography>} />

                                <CardContent>
                                    <Typography variant="h6" sx={{ marginTop: "-15px", color: "#52575e" }}>Batting Hand: {this.state.basic_info.batting_hand}</Typography>
                                    <Typography gutterBottom variant="h6" sx={{ marginTop: "-5px", color: "#52575e" }}>Bowling Skill: {this.state.basic_info.bowling_skill}</Typography>

                                    <Tabs value={this.state.value} onChange={this.handleChange} aria-label="basic tabs example">
                                        <Tab label="Batting Stats" {...a11yProps(0)} />
                                        <Tab label="Bowling Stats" {...a11yProps(1)} />
                                    </Tabs>

                                    <TabPanel value={this.state.value} index={0}>
                                        <Batting stats={this.state.battingStats} graph={this.state.battingGraph} />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={1}>
                                        <Bowling stats={this.state.bowlingStats} graph={this.state.bowlingGraph} />
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
const NewPlayerInfo = (props) => (<PlayerInfo params={useParams()} />);
export default NewPlayerInfo;
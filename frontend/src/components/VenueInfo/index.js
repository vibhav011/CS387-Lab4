import { Alert, CardContent, CardHeader, Snackbar } from "@mui/material";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import CustomTable2 from "components/CustomTable2";
// Material Kit 2 React components
import MKBox from "components/MKBox";
import BaseLayout from "layouts/sections/components/BaseLayout";
import PropTypes from 'prop-types';
import React from "react";
import { useParams } from 'react-router-dom';
import FirstInnings from "./first_innings";
import Outline from "./outline";



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

const jsonKeys = ["venue_name", "address", "capacity", "total_matches_played", "highest_total_recorded", "lowest_total_recorded", "highest_score_chased"];

class VenueInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            basicInfo: [["Venue name", "Venue Name"],
            ["Address", "City, Country"],
            ["Capacity", ""],
            ["Total matches played", ""],
            ["Highest total recorded", ""],
            ["Lowest total recorded", ""],
            ["Highest score chased", ""]
            ],
            outline: {},
            first_innings: [],
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
        fetch(`http://localhost:8081/venues/basic_info/${id}`)
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(data => {
                let body = data.body;

                if (data.status === 200) {
                    let info = body.data[0];
                    let newInfo = {};
                    Object.keys(info).map(k => {
                        if (k !== "city_name" || k !== "country_name")
                            newInfo[k] = info[k];
                        return null;
                    });
                    newInfo["address"] = `${info["city_name"]}, ${info["country_name"]}`;
                    let b = this.state.basicInfo;
                    jsonKeys.map((k, i) => b[i][1] = newInfo[k]);
                    this.setState({ basicInfo: b });
                }
                else {
                    this.setState({ open: true, msg: `Error ${data.status}: ${body.error}` });
                    console.log("Error in scorecard fetch");
                    console.log(body.error);
                }
            });

        fetch(`http://localhost:8081/venues/pie_chart/${id}`)
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(data => {
                let body = data.body;

                if (data.status === 200) {
                    this.setState({ outline: body.data[0] });
                }
                else {
                    console.log("Error in score_comparison fetch");
                    console.log(body.error);
                }
            });

        fetch(`http://localhost:8081/venues/venue_first_innings/${id}`)
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(data => {
                let body = data.body;

                if (data.status === 200) {
                    this.setState({ first_innings: body.data });
                }
                else {
                    console.log("Error in score_comparison fetch");
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
            <BaseLayout title="Venue Info"
                breadcrumb={[
                    { label: "Home", route: "/" },
                    { label: "Venue Info" },
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
                                    title={<Typography variant="h3">{this.state.basicInfo[0][1]}</Typography>}
                                    subheader={<Typography sx={{ color: "#52575e" }} variant="h4">{this.state.basicInfo[1][1]}</Typography>} />

                                <CardContent>
                                    <Tabs value={this.state.value} onChange={this.handleChange} aria-label="basic tabs example">
                                        <Tab label="Basic Info" {...a11yProps(0)} />
                                        <Tab label="Outline" {...a11yProps(1)} />
                                        <Tab label="Average Score" {...a11yProps(2)} />
                                    </Tabs>

                                    <TabPanel value={this.state.value} index={0}>
                                        <CustomTable2 rows={this.state.basicInfo} />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={1}>
                                        <Outline data={this.state.outline} />
                                    </TabPanel>
                                    <TabPanel value={this.state.value} index={2}>
                                        <FirstInnings data={this.state.first_innings} />
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

const NewVenueInfo = (props) => (<VenueInfo params={useParams()} />);
export default NewVenueInfo;
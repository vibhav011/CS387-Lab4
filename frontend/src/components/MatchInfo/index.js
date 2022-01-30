import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useSearchParams, useParams } from 'react-router-dom'

// Table
import CustomTable from "components/CustomTable";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import BaseLayout from "layouts/sections/components/BaseLayout";
import { useEffect, useRef, useState } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ScorecardElement from "./scorecard";

function MatchInfo(props) {
    const { id } = useParams();
    const [expanded, setExpanded] = useState('panel1');

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    return (
        <BaseLayout title="Match Info"
            breadcrumb={[
                { label: "Home", route: "/" },
                { label: "Match Info" },
            ]}>
            <MKBox component="section" py={{ xs: 3, md: 3 }}>
                <Container>
                    <Grid container alignItems="center" justifyContent="center">
                        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx = {{borderRadius: '10px', width: "85%"}}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx ={{color:"#fff"}} />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                                sx = {{backgroundColor: '#384664', borderRadius: '10px'}}
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0, color:"#fff", fontWeight:"bold" }}>
                                    Scorecard
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            {ScorecardElement}
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx = {{borderRadius: '10px', width: "85%", marginTop: '10px', marginBottom: '10px'}}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx ={{color:"#fff"}}/>}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                                sx = {{backgroundColor: '#384664', borderRadius: '10px'}}
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0, color:"#fff", fontWeight:"bold" }}>
                                    Score Comparison
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                                    Aliquam eget maximus est, id dignissim quam.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} sx = {{borderRadius: '10px', width: "85%"}}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx ={{color:"#fff"}} />}
                                aria-controls="panel3bh-content"
                                id="panel3bh-header"
                                sx = {{backgroundColor: '#384664', borderRadius: '10px'}}
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0, color:"#fff", fontWeight:"bold" }}>
                                    Summary
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                                    Aliquam eget maximus est, id dignissim quam.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Container>
            </MKBox>
        </BaseLayout>
    );
}

export default MatchInfo;
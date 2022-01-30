import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomTable2 from 'components/CustomTable2';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const headers_bat = [
    'Batter', 'Runs', 'Fours', 'Sixes', 'Balls faced'
]

const headers_bowl = [
    'Bowler', 'Balls Bowled', 'Runs Given', 'Wickets'
]

const dummy_rows = [
    ['Match', 'WIU19 vs AUSU19, 1st Match, Group D, ICC Under 19 World Cup 2022'],
    ['Toss', 'West Indies U19 won the toss and opt to bat'],
    ['Venue', 'Providence Stadium, Guyana'],
    ['Umpires', 'Buddhi Pradhan, David Millns'],
    ['Playing XI of team1', 'Matthew Nandu, Shaqkere Parris, Teddy Bishop, Rivaldo Clarke (wk), Ackeem Auguste (c), Giovonte Depeiza, Anderson Mahase, Johann Layne, McKenny Clarke, Shiva Sankar, Onaje Amory'],
    ['Playing XI of team2', 'Teague Wyllie, Corey Miller, Isaac Higgins, Cooper Connolly (c), Nivethan Radhakrishnan, Campbell Kellaway, Aidan Cahill, Tobias Snell (wk), William Salzmann, Tom Whitney, Harkirat Bajwa']
]

function formatter(data, inn, bat) {
    return data[inn][bat].map((d) => {
        return Object.keys(d).map((k) => { return d[k]; })
    });
}

function formatter2(data) {
    data = data['match_info']
    let info = data['info'][0]
    let players = data['players']
    let umpires = data['umpires']['umpire_names']

    return [
        ['Match', `${info['match_id']}, ${info['team1_name']} vs ${info['team2_name']}, ${info['year_of_playing']}`],
        ['Toss', `${info['toss_winner_name']} won the toss and opt to ${info['toss_name']}`],
        ['Venue', `${info['venue']}`],
        ['Umpires', `${umpires.join(', ')}`],
        ['Playing XI of team1', `${players['team1_players'].join(', ')}`],
        ['Playing XI of team2', `${players['team2_players'].join(', ')}`]
    ]
}

function ScorecardElement(props) {
    let data = props.data;
    if (Object.keys(data).length === 0) {
        return (<><CircularProgress /></>)
    }

    return (<>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-inner-header"
            >
                <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold" }}>
                    Innings 1
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <CustomTable2 header={headers_bat} rows={formatter(data, 'innings1', 'batting')} />
                <Typography>&nbsp;</Typography>
                <CustomTable2 header={headers_bowl} rows={formatter(data, 'innings1', 'bowling')} />
            </AccordionDetails>
        </Accordion>

        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-inner-header3"
            >
                <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold" }}>
                    Innings 2
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <CustomTable2 header={headers_bat} rows={formatter(data, 'innings2', 'batting')} />
                <Typography>&nbsp;</Typography>
                <CustomTable2 header={headers_bowl} rows={formatter(data, 'innings2', 'bowling')} />
            </AccordionDetails>
        </Accordion>

        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-inner-header3"
            >
                <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold" }}>
                    Match Info
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <CustomTable2 rows={formatter2(data)} />
            </AccordionDetails>
        </Accordion>
    </>)
}

export default ScorecardElement;
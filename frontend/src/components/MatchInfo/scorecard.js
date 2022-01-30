import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomTable from 'components/CustomTable';

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

const ScorecardElement = <>
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
            <CustomTable header={headers_bat} rows={[[]]} skip={1} limit={1} pagination={false} />
            <Typography>&nbsp;</Typography>
            <CustomTable header={headers_bowl} rows={[[]]} skip={1} limit={1} pagination={false} />
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
            <CustomTable header={headers_bat} rows={[[]]} skip={1} limit={1} pagination={false} />
            <Typography>&nbsp;</Typography>
            <CustomTable header={headers_bowl} rows={[[]]} skip={1} limit={1} pagination={false} />
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
            <CustomTable header={["", ""]} rows={dummy_rows} skip={1} limit={1} pagination={false} headersEnabled={false}/>
        </AccordionDetails>
    </Accordion>
</>

export default ScorecardElement;
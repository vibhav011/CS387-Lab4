import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import CustomTable2 from 'components/CustomTable2';

const headers_bat = [
    'Batter', 'Runs', 'Fours', 'Sixes', 'Balls faced'
]
const headers_bowl = [
    'Bowler', 'Balls Bowled', 'Runs Given', 'Wickets'
]
const json_keys = {
    batting: ['batter', 'runs', 'fours', 'sixes', 'balls_faced'],
    bowling: ['bowler', 'balls_bowled', 'runs_given', 'wickets']
}

function formatter(data, inn, bat) {
    return data[inn][bat].map((d) => {
        return json_keys[bat].map((k, i) => {
            return (i === 0) ? <a href={"/players/"+d["player_id"]} style={{ color: "#3d82cc", fontWeight: "bold" }}>{d[k]}</a> : d[k]
        })
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
        <Accordion defaultExpanded={true}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-inner-header"
                sx={{ backgroundColor: '#fff'}}
            >
                <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold", color:"#4e4e4e" }}>
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
                sx={{ backgroundColor: '#fff'}}
            >
                <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold", color:"#4e4e4e" }}>
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
                sx={{ backgroundColor: '#fff'}}
            >
                <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold", color:"#4e4e4e" }}>
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